
import { useState } from "react";
import Effects from "./Effects";
import AIAssistant from "./AIAssistant";
import "./App.css";

const projects = [
  {
    number: "01",
    title: "AI & Machine Learning",
    description:
      "Experiments and projects exploring intelligent systems, machine learning concepts, and practical AI applications.",
    tags: ["Python", "AI", "Machine Learning"],
    status: "EXPLORING",
  },
  {
    number: "02",
    title: "Rabindra AI Website",
    description:
      "A personal portfolio with a cinematic interface, interactive motion, voice-enabled AI assistance, and a custom visual identity.",
    tags: ["React", "TypeScript", "CSS"],
    status: "IN DEVELOPMENT",
  },
  {
    number: "03",
    title: "Programming Experiments",
    description:
      "A growing collection of programming exercises, experiments, and projects built while learning software development.",
    tags: ["Java", "Python", "GitHub"],
    status: "ONGOING",
  },
];

const skills = [
  { name: "Artificial Intelligence", category: "AI & ML" },
  { name: "Machine Learning", category: "AI & ML" },
  { name: "Python", category: "PROGRAMMING" },
  { name: "Java", category: "PROGRAMMING" },
  { name: "React", category: "WEB DEVELOPMENT" },
  { name: "TypeScript", category: "WEB DEVELOPMENT" },
  { name: "HTML & CSS", category: "WEB DEVELOPMENT" },
  { name: "Git & GitHub", category: "TOOLS" },
];

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="site-shell" id="home">
      <Effects />

      <header className="site-header">
        <a
          className="brand"
          href="#home"
          onClick={closeMenu}
          aria-label="Rabindra home"
        >
          <span className="brand-mark">R.</span>
          <span className="brand-name">
            RABINDRA<span>_AI</span>
          </span>
        </a>

        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={`site-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          {[
            ["About", "#about"],
            ["Projects", "#projects"],
            ["Skills", "#skills"],
            ["AI Assistant", "#ai-assistant"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={closeMenu}>
              {label}
            </a>
          ))}

          <a className="nav-cta" href="#contact" onClick={closeMenu}>
            Let's talk <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="availability">
            <span className="availability-dot" />
            BUILDING SOMETHING NEW
          </div>

          <p className="hero-intro">HELLO, WORLD. I'M</p>

          <h1>
            Rabindra<span className="hero-period">.</span>
            <br />
            <span className="hero-outline">THINKING</span>
            <br />
            IN THE FUTURE.
          </h1>

          <p className="hero-description">
            Exploring the intersection of artificial intelligence,
            technology, and creative development. Turning ideas into
            interactive digital experiences.
          </p>

          <div className="hero-actions">
            <a className="button-primary" href="#projects">
              Explore my work <span aria-hidden="true">↗</span>
            </a>

            <a className="button-secondary" href="#about">
              Discover more
            </a>
          </div>

          <div className="hero-meta">
            <span>AI & ML ENTHUSIAST</span>
            <span className="meta-separator">/</span>
            <span>DEVELOPER IN PROGRESS</span>
          </div>
        </div>

        {/* Animated orbital artwork with the custom AI logo */}
        <div
          className="hero-visual"
          aria-label="Rabindra AI animated orbital artwork"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />

          <img
            className="hero-core hero-ai-logo"
            src="/rabindra-ai-logo.png"
            alt="Rabindra AI logo"
            draggable={false}
          />

          <div className="orbit-label orbit-label-top">
            <span className="orbit-label-dot" />
            INTELLIGENCE
          </div>

          <div className="orbit-label orbit-label-bottom">
            DIGITAL UNIVERSE
          </div>

          <span className="visual-coordinate coordinate-top">
            20.2961° N
          </span>

          <span className="visual-coordinate coordinate-bottom">
            85.8245° E
          </span>
        </div>

        <a className="scroll-indicator" href="#about">
          <span className="scroll-line" />
          SCROLL TO EXPLORE
        </a>

        <span className="hero-index">01 — INTRODUCTION</span>
      </section>

      {/* About */}
      <section className="content-section about-section" id="about">
        <div className="section-heading">
          <span className="section-kicker">01 / ABOUT</span>

          <h2>
            Curious mind.
            <br />
            <span>Builder's mindset.</span>
          </h2>
        </div>

        <div className="about-content">
          <p className="about-lead">
            I'm Rabindra — exploring how technology can turn ambitious
            ideas into useful, engaging experiences.
          </p>

          <p className="about-description">
            My interests include artificial intelligence, machine learning,
            software development, and interactive web experiences. I'm
            continually learning, experimenting, and building projects that
            help me turn theory into practice.
          </p>

          <a className="text-link" href="#projects">
            Explore my projects <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="about-stats">
          <div className="stat-item">
            <span className="stat-value">AI/ML</span>
            <span className="stat-label">AREA OF INTEREST</span>
          </div>

          <div className="stat-item">
            <span className="stat-value">BUILD</span>
            <span className="stat-label">LEARN BY DOING</span>
          </div>

          <div className="stat-item">
            <span className="stat-value">∞</span>
            <span className="stat-label">ROOM TO EXPLORE</span>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="content-section projects-section" id="projects">
        <div className="section-heading section-heading-row">
          <div>
            <span className="section-kicker">02 / SELECTED WORK</span>

            <h2>
              Ideas into
              <br />
              <span>experiments.</span>
            </h2>
          </div>

          <span className="section-side-note">
            A COLLECTION OF WORK
            <br />
            AND CONTINUOUS LEARNING
          </span>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.number}>
              <div className="project-card-top">
                <span className="project-number">{project.number}</span>
                <span className="project-status">{project.status}</span>
              </div>

              <div className="project-art" aria-hidden="true">
                <div className="project-art-orbit" />

                <div className="project-art-core">
                  {project.number === "01"
                    ? "AI"
                    : project.number === "02"
                      ? "R."
                      : "{ }"}
                </div>
              </div>

              <h3>{project.title}</h3>
              <p>{project.description}</p>

              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="content-section skills-section" id="skills">
        <div className="section-heading">
          <span className="section-kicker">03 / CAPABILITIES</span>

          <h2>
            Tools for
            <br />
            <span>the journey.</span>
          </h2>

          <p className="section-description">
            Technologies and concepts I'm exploring as I build my
            development toolkit.
          </p>
        </div>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div className="skill-card" key={skill.name}>
              <span className="skill-index">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="skill-category">{skill.category}</span>
              <h3>{skill.name}</h3>
              <span className="skill-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Dedicated AI section and floating assistant */}
      <AIAssistant />

      {/* Contact */}
      <section className="content-section contact-section" id="contact">
        <div className="contact-glow" aria-hidden="true" />

        <div className="section-heading">
          <span className="section-kicker">04 / GET IN TOUCH</span>

          <h2>
            Have an idea?
            <br />
            <span>Let's connect.</span>
          </h2>
        </div>

        <div className="contact-content">
          <p>
            Interested in technology, AI, or collaborating on a project?
            I'd be happy to connect.
          </p>

          <a className="button-primary" href="mailto:hello@example.com">
            Contact Rabindra <span aria-hidden="true">↗</span>
          </a>

          <p className="contact-note">
            Replace hello@example.com with your real email address before
            publishing your website.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark">R.</span>
          <span className="brand-name">
            RABINDRA<span>_AI</span>
          </span>
        </a>

        <p>DESIGNED TO EXPLORE WHAT'S NEXT.</p>

        <a href="#home" className="back-to-top">
          BACK TO TOP ↑
        </a>

        <span className="footer-copyright">
          © {new Date().getFullYear()} RABINDRA
        </span>
      </footer>
    </main>
  );
}
