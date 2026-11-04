
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import "./Effects.css";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  angle: number;
};

export default function Effects() {
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const nextId = useRef(0);
  const audioContext = useRef<AudioContext | null>(null);
  const lastScrollSound = useRef(0);
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    let disposed = false;

    function playSound(kind: "click" | "scroll") {
      if (!soundEnabled || disposed) return;

      try {
        const AudioContextClass =
          window.AudioContext ||
          (
            window as typeof window & {
              webkitAudioContext?: typeof AudioContext;
            }
          ).webkitAudioContext;

        if (!AudioContextClass) return;

        audioContext.current ??= new AudioContextClass();
        const context = audioContext.current;

        if (context.state === "suspended") {
          void context.resume();
        }

        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const now = context.currentTime;

        oscillator.type = "sine";

        if (kind === "click") {
          oscillator.frequency.setValueAtTime(660, now);
          oscillator.frequency.exponentialRampToValueAtTime(
            880,
            now + 0.07
          );
        } else {
          oscillator.frequency.setValueAtTime(420, now);
          oscillator.frequency.exponentialRampToValueAtTime(
            520,
            now + 0.045
          );
        }

        const volume = kind === "click" ? 0.035 : 0.012;
        const duration = kind === "click" ? 0.1 : 0.06;

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          now + duration
        );

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(now);
        oscillator.stop(now + duration);
      } catch {
        // Audio is optional; the website works without it.
      }
    }

    const onMove = (event: PointerEvent) => {
      if (!finePointer) return;

      setCursor({ x: event.clientX, y: event.clientY });

      const target = event.target;

      if (target instanceof Element) {
        const card = target.closest<HTMLElement>(".project-card");

        if (card) {
          const rect = card.getBoundingClientRect();

          if (rect.width > 0 && rect.height > 0) {
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            card.style.setProperty(
              "--tilt-x",
              `${(0.5 - y) * 8}deg`
            );
            card.style.setProperty(
              "--tilt-y",
              `${(x - 0.5) * 8}deg`
            );
          }
        }
      }

      document
        .querySelectorAll<HTMLElement>(".project-card")
        .forEach((card) => {
          if (!card.matches(":hover")) {
            card.style.setProperty("--tilt-x", "0deg");
            card.style.setProperty("--tilt-y", "0deg");
          }
        });
    };

    const onLeaveCard = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) return;

      const card = target.closest<HTMLElement>(".project-card");

      if (!card) return;

      if (
        event.relatedTarget instanceof Node &&
        card.contains(event.relatedTarget)
      ) {
        return;
      }

      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };

    const onClick = (event: MouseEvent) => {
      const particles: Sparkle[] = Array.from({ length: 7 }, () => ({
        id: nextId.current++,
        x: event.clientX,
        y: event.clientY,
        angle: Math.random() * 360,
      }));

      setSparkles((previous) => [...previous, ...particles]);

      window.setTimeout(() => {
        const ids = new Set(particles.map((particle) => particle.id));

        setSparkles((previous) =>
          previous.filter((particle) => !ids.has(particle.id))
        );
      }, 750);

      playSound("click");
    };

    const onScroll = () => {
      const currentPosition = window.scrollY;
      const distance = Math.abs(
        currentPosition - lastScrollPosition.current
      );

      lastScrollPosition.current = currentPosition;

      // Avoid sound on tiny movements and rapid scroll events.
      if (distance < 40) return;

      const now = performance.now();

      // Play at most one scroll sound every 350 ms.
      if (now - lastScrollSound.current < 350) return;

      lastScrollSound.current = now;
      playSound("scroll");
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerout", onLeaveCard);
    window.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      disposed = true;

      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeaveCard);
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);

      const context = audioContext.current;
      audioContext.current = null;

      if (context && context.state !== "closed") {
        void context.close();
      }
    };
  }, [soundEnabled]);

  return (
    <>
      <div
        className="rabindra-cursor"
        style={{ left: cursor.x, top: cursor.y }}
        aria-hidden="true"
      />

      <div className="sparkle-layer" aria-hidden="true">
        {sparkles.map((sparkle) => (
          <span
            className="click-sparkle"
            key={sparkle.id}
            style={
              {
                left: sparkle.x,
                top: sparkle.y,
                "--sparkle-angle": `${sparkle.angle}deg`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <button
        className="sound-toggle"
        type="button"
        aria-pressed={soundEnabled}
        onClick={() => setSoundEnabled((enabled) => !enabled)}
        title="Toggle click and scroll sounds"
      >
        <span aria-hidden="true">
          {soundEnabled ? "♫" : "♪"}
        </span>
        SOUND {soundEnabled ? "ON" : "OFF"}
      </button>
    </>
  );
}
