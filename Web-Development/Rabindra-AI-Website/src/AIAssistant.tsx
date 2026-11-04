
import { useEffect, useRef, useState } from "react";
import "./AIAssistant.css";

type Message = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

type SpeechRecognitionAlternative = {
  transcript: string;
};

type SpeechRecognitionResult = {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
};

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResult>;
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const WELCOME_MESSAGE =
  "Hello! I'm Rabindra's assistant. I can help you explore Rabindra's portfolio, projects, skills, and website. What would you like to know?";

const knowledge = [
  {
    keywords: ["who are you", "your name", "introduce", "who is this"],
    answer:
      "Hello! I'm Rabindra's assistant. I'm here to help you explore this website and learn about Rabindra's work.",
  },
  {
    keywords: ["rabindra", "about", "background", "student"],
    answer:
      "Rabindra is a technology enthusiast interested in artificial intelligence, machine learning, software development, and interactive web experiences. Explore the About section to learn more.",
  },
  {
    keywords: ["project", "work", "portfolio"],
    answer:
      "You can explore Rabindra's projects in the Projects section. It highlights his work, experiments, and developing ideas. Some projects may still be in progress.",
  },
  {
    keywords: ["skill", "technology", "programming", "language"],
    answer:
      "Rabindra is developing skills in AI, machine learning, programming, and web development. Visit the Skills section for the technologies featured on this website.",
  },
  {
    keywords: ["contact", "email", "hire", "message"],
    answer:
      "You can reach out through the Contact section of this website. Check the available contact details there before sending your message.",
  },
  {
    keywords: ["voice", "speak", "microphone", "talk"],
    answer:
      "You can talk to me using the microphone button or type your question in the message box. Turn on spoken replies if you'd like me to read my answers aloud.",
  },
  {
    keywords: ["website", "design", "animation", "logo"],
    answer:
      "This website uses a futuristic visual style with dark surfaces, purple and blue accents, orbital graphics, motion effects, and a personal assistant.",
  },
  {
    keywords: ["thank", "thanks"],
    answer:
      "You're very welcome! I'm Rabindra's assistant, and I'm happy to help you explore the website.",
  },
];

function getReply(question: string): string {
  const normalized = question.toLowerCase();

  for (const item of knowledge) {
    if (item.keywords.some((keyword) => normalized.includes(keyword))) {
      return item.answer;
    }
  }

  return (
    "I can help you explore Rabindra's background, projects, skills, contact section, and this website. " +
    "Try asking me about one of those topics. My current version uses built-in demo responses rather than a connected AI service."
  );
}

function getMalePreferredVoice(): SpeechSynthesisVoice | undefined {
  if (!("speechSynthesis" in window)) return undefined;

  const voices = window.speechSynthesis.getVoices();
  const englishVoices = voices.filter((voice) =>
    /^en(-|_)/i.test(voice.lang)
  );

  // Prefer common masculine-sounding English voice names when available.
  const preferredNames =
    /david|mark|guy|ryan|christopher|eric|daniel|james|alex|fred/i;

  return (
    englishVoices.find((voice) => preferredNames.test(voice.name)) ??
    englishVoices.find((voice) => /en-IN/i.test(voice.lang)) ??
    englishVoices.find((voice) => /en-US/i.test(voice.lang)) ??
    englishVoices[0] ??
    voices[0]
  );
}

function speakResponse(text: string): void {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getMalePreferredVoice();

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-IN";
  }

  utterance.rate = 0.95;
  utterance.pitch = 0.95;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

function createRecognition(): SpeechRecognitionInstance | null {
  const browserWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  const Recognition =
    browserWindow.SpeechRecognition ??
    browserWindow.webkitSpeechRecognition;

  if (!Recognition) return null;

  return new Recognition();
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speakingReplies, setSpeakingReplies] = useState(false);
  const [status, setStatus] = useState("Ready to help");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text: WELCOME_MESSAGE,
    },
  ]);

  const nextId = useRef(2);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const floatingInputRef = useRef<HTMLInputElement | null>(null);
  const sectionMessagesEndRef = useRef<HTMLDivElement | null>(null);
  const floatingMessagesEndRef = useRef<HTMLDivElement | null>(null);
  const replyTimerRef = useRef<number | null>(null);
  const speakingRepliesRef = useRef(speakingReplies);

  useEffect(() => {
    speakingRepliesRef.current = speakingReplies;
  }, [speakingReplies]);

  useEffect(() => {
    sectionMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    floatingMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();

      if (replyTimerRef.current !== null) {
        window.clearTimeout(replyTimerRef.current);
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function addMessage(role: Message["role"], text: string) {
    setMessages((previous) => [
      ...previous,
      {
        id: nextId.current++,
        role,
        text,
      },
    ]);
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function sendMessage(message?: string) {
    const question = (message ?? input).trim();
    if (!question) return;

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    }

    stopSpeaking();
    addMessage("user", question);
    setInput("");
    setStatus("Thinking…");

    if (replyTimerRef.current !== null) {
      window.clearTimeout(replyTimerRef.current);
    }

    // Local demo response. Connect a secure backend for real AI;
    // never expose API keys in this file.
    replyTimerRef.current = window.setTimeout(() => {
      const answer = getReply(question);
      addMessage("assistant", answer);
      setStatus("Ready to help");

      if (speakingRepliesRef.current) {
        speakResponse(answer);
      }

      replyTimerRef.current = null;
    }, 300);
  }

  function startListening() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      setStatus("Ready to help");
      return;
    }

    const recognition = createRecognition();

    if (!recognition) {
      setStatus("Voice input is not supported in this browser");
      return;
    }

    recognitionRef.current = recognition;
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setInput(transcript.trim());
    };

    recognition.onerror = (event) => {
      setListening(false);

      const errorMessages: Record<string, string> = {
        "not-allowed": "Please allow microphone access in your browser",
        "service-not-allowed": "Microphone access is blocked by browser settings",
        "no-speech": "No speech detected. Please try again",
        "audio-capture": "No microphone was detected",
        network: "Voice recognition needs a network connection",
        aborted: "Voice input stopped",
      };

      setStatus(errorMessages[event.error] ?? "Voice input could not start");
    };

    recognition.onend = () => {
      setListening(false);
      setStatus((current) =>
        current === "Listening — speak now" ? "Ready to help" : current
      );
    };

    try {
      recognition.start();
      setListening(true);
      setStatus("Listening — speak now");
    } catch {
      setListening(false);
      setStatus("Could not start the microphone. Please try again");
    }
  }

  function readLatestReply() {
    const latestReply = [...messages]
      .reverse()
      .find((message) => message.role === "assistant");

    if (latestReply) speakResponse(latestReply.text);
  }

  function openAssistant() {
    setIsOpen(true);
    window.setTimeout(() => floatingInputRef.current?.focus(), 50);
  }

  function renderFloatingMessages() {
    return messages.map((message) => (
      <div
        key={message.id}
        className={`ai-assistant-floating-message ${
          message.role === "user" ? "from-user" : "from-assistant"
        }`}
      >
        {message.text}
      </div>
    ));
  }

  return (
    <>
      <section
        className="ai-assistant-section"
        id="ai-assistant"
        aria-labelledby="assistant-heading"
      >
        <div className="ai-assistant-intro">
          <p className="ai-assistant-eyebrow">YOUR PERSONAL AI GUIDE</p>

          <h2 id="assistant-heading">
            Meet <span>Rabindra&apos;s assistant.</span>
          </h2>

          <p>
            Ask a question, type a message, or use your voice. Receive answers
            in text, and optionally hear them spoken aloud.
          </p>

          <button
            type="button"
            className="ai-assistant-start"
            onClick={openAssistant}
          >
            Start a conversation <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="ai-assistant-panel">
          <div className="ai-assistant-panel-header">
            <img
              className="ai-assistant-logo"
              src="/rabindra-ai-logo.png"
              alt="Rabindra assistant logo"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

            <div>
              <h3>Rabindra&apos;s assistant</h3>
              <p>
                <span className="ai-assistant-status-dot" />
                <span>{status}</span>
              </p>
            </div>

            <button
              type="button"
              className="ai-assistant-icon-button"
              onClick={readLatestReply}
              aria-label="Read the latest answer aloud"
              title="Read latest answer aloud"
            >
              🔊
            </button>
          </div>

          <div className="ai-assistant-messages" aria-live="polite">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`ai-assistant-message ${
                  message.role === "user"
                    ? "ai-assistant-message-user"
                    : "ai-assistant-message-bot"
                }`}
              >
                {message.role === "assistant" && (
                  <img
                    src="/rabindra-ai-logo.png"
                    alt=""
                    className="ai-assistant-message-logo"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                )}

                <div className="ai-assistant-message-content">
                  <span className="ai-assistant-message-label">
                    {message.role === "user" ? "YOU" : "RABINDRA'S ASSISTANT"}
                  </span>

                  <p>{message.text}</p>

                  {message.role === "assistant" && (
                    <button
                      type="button"
                      className="ai-assistant-read-button"
                      onClick={() => speakResponse(message.text)}
                    >
                      ▶ Read aloud
                    </button>
                  )}
                </div>
              </article>
            ))}

            <div ref={sectionMessagesEndRef} />
          </div>

          <div className="ai-assistant-controls">
            <label className="ai-assistant-spoken-toggle">
              <input
                type="checkbox"
                checked={speakingReplies}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  setSpeakingReplies(enabled);

                  if (!enabled) stopSpeaking();
                }}
              />
              Speak replies automatically
            </label>

            <div className="ai-assistant-input-row">
              <textarea
                ref={inputRef}
                className="ai-assistant-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask me about Rabindra's projects..."
                rows={2}
                aria-label="Your message"
              />

              <div className="ai-assistant-action-buttons">
                <button
                  type="button"
                  className={`ai-assistant-mic-button ${
                    listening ? "is-listening" : ""
                  }`}
                  onClick={startListening}
                  aria-label={listening ? "Stop listening" : "Start voice input"}
                  title={listening ? "Stop listening" : "Speak your question"}
                >
                  {listening ? "■" : "🎙"}
                </button>

                <button
                  type="button"
                  className="ai-assistant-send-button"
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                >
                  Send ↗
                </button>
              </div>
            </div>

            <p className="ai-assistant-note">
              Microphone access is requested by your browser. Voice input
              depends on browser support and may require an internet connection.
            </p>
          </div>
        </div>
      </section>

      <button
        type="button"
        className={`ai-assistant-floating-orb ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close Rabindra's assistant" : "Open Rabindra's assistant"}
        aria-expanded={isOpen}
        title="Talk to Rabindra's assistant"
      >
        <img
          src="/rabindra-ai-logo.png"
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <span aria-hidden="true" style={{ display: "none" }}>R.</span>
      </button>

      {isOpen && (
        <aside
          className="ai-assistant-floating-window"
          aria-label="Rabindra's assistant chat"
        >
          <div className="ai-assistant-floating-header">
            <img
              src="/rabindra-ai-logo.png"
              alt=""
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />

            <div>
              <strong>Rabindra&apos;s assistant</strong>
              <span>{status}</span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="ai-assistant-close"
            >
              ×
            </button>
          </div>

          <div className="ai-assistant-floating-messages" aria-live="polite">
            {renderFloatingMessages()}
            <div ref={floatingMessagesEndRef} />
          </div>

          <div className="ai-assistant-floating-controls">
            <label className="ai-assistant-spoken-toggle">
              <input
                type="checkbox"
                checked={speakingReplies}
                onChange={(event) => {
                  const enabled = event.target.checked;
                  setSpeakingReplies(enabled);

                  if (!enabled) stopSpeaking();
                }}
              />
              Spoken replies
            </label>

            <div className="ai-assistant-floating-input-row">
              <input
                ref={floatingInputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                aria-label="Type a message"
              />

              <button
                type="button"
                onClick={startListening}
                aria-label={listening ? "Stop microphone" : "Use microphone"}
                title={listening ? "Stop microphone" : "Use microphone"}
                className={listening ? "is-listening" : ""}
              >
                {listening ? "■" : "🎙"}
              </button>

              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                →
              </button>
            </div>

            <p className="ai-assistant-note">
              {listening
                ? "Listening — speak now"
                : "Enter to send · Shift+Enter for a new line in the main chat"}
            </p>
          </div>
        </aside>
      )}
    </>
  );
}
