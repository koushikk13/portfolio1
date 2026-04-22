import { useEffect, useState } from "react";
import AmbientCanvas from "./components/AmbientCanvas";
import Reveal from "./components/Reveal";
import TiltPanel from "./components/TiltPanel";
import {
  achievements,
  creativePillars,
  experiences,
  metrics,
  navigation,
  processMoments,
  profile,
  projects,
  skillGroups,
} from "./data";

const heroChips = [
  "3D-feel motion",
  "Editorial composition",
  "Data pipeline thinking",
  "AI product storytelling",
];

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

function MetricCard({ metric }) {
  return (
    <div className="metric-card">
      <strong>{metric.value}</strong>
      <span>{metric.label}</span>
    </div>
  );
}

function ExperienceCard({ item }) {
  return (
    <Reveal className="timeline-card">
      <div className="timeline-meta">
        <span>{item.duration}</span>
        <h3>{item.role}</h3>
        <p>{item.company}</p>
      </div>
      <div className="timeline-copy">
        <p>{item.statement}</p>
        <ul>
          {item.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function ProjectCard({ project, featured = false }) {
  return (
    <TiltPanel className={`project-card${featured ? " featured" : ""}`} as="article">
      <div className="project-topline">
        <span>{project.year}</span>
        <div className="project-tags">
          {project.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <ul>
        {project.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
    </TiltPanel>
  );
}

function SkillGroup({ group }) {
  return (
    <TiltPanel className="skill-card">
      <div className="skill-card-header">
        <h3>{group.title}</h3>
        <p>{group.description}</p>
      </div>
      <div className="skill-chip-cloud">
        {group.items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </TiltPanel>
  );
}

function CreativePillar({ pillar }) {
  return (
    <TiltPanel className="pillar-card">
      <span className="card-tag">{pillar.title}</span>
      <p>{pillar.description}</p>
    </TiltPanel>
  );
}

function ProcessCard({ item }) {
  return (
    <TiltPanel className="process-card">
      <span>{item.index}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </TiltPanel>
  );
}

function ProfilePrism({ photoHref, placeholderHref }) {
  const [fallbackActive, setFallbackActive] = useState(false);
  const imageSource = fallbackActive ? placeholderHref : photoHref;
  const helperCopy = fallbackActive
    ? "Add your portrait as public/profile-photo.jpg and this hero frame will switch automatically."
    : "Your profile portrait is active inside the hero frame.";

  return (
    <div className="photo-prism">
      <div className="photo-aura photo-aura-one" />
      <div className="photo-aura photo-aura-two" />
      <div className="photo-track photo-track-one" />
      <div className="photo-track photo-track-two" />

      <TiltPanel className="photo-card">
        <div className="photo-card-frame">
          <img
            className="profile-photo"
            src={imageSource}
            alt={`${profile.fullName} portrait`}
            onError={() => {
              if (!fallbackActive) {
                setFallbackActive(true);
              }
            }}
          />
          <div className="photo-grid-overlay" />
        </div>

        <div className="photo-card-meta">
          <span className="card-tag">Portrait frame</span>
          <strong>{profile.fullName}</strong>
          <small>{helperCopy}</small>
        </div>
      </TiltPanel>
    </div>
  );
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const tickerItems = skillGroups.flatMap((group) => group.items);
  const resumeHref = `${import.meta.env.BASE_URL}koushik-resume.pdf`;
  const photoHref = `${import.meta.env.BASE_URL}profile-photo.jpg`;
  const placeholderHref = `${import.meta.env.BASE_URL}profile-placeholder.svg`;

  useEffect(() => {
    const updateScrollProgress = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextValue = pageHeight > 0 ? window.scrollY / pageHeight : 0;
      setScrollProgress(nextValue);
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  useEffect(() => {
    const handlePointer = (event) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });

    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  return (
    <div className="app-shell">
      <AmbientCanvas />
      <div className="page-noise" aria-hidden="true" />
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} />

      <header className="site-header">
        <a className="brand-mark" href="#top">
          <span>KK</span>
          <div>
            <strong>{profile.name}</strong>
            <small>{profile.title}</small>
          </div>
        </a>

        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href={resumeHref} target="_blank" rel="noreferrer">
          Resume
        </a>
      </header>

      <main>
        <section className="hero section" id="top">
          <Reveal className="hero-copy">
            <div className="hero-kicker-row">
              <span className="eyebrow">{profile.heroEyebrow}</span>
              <span className="hero-status">Open to ambitious product roles</span>
            </div>
            <h1>Immersive interfaces. Intelligent systems. A portfolio designed to feel alive.</h1>
            <p className="hero-summary">{profile.summary}</p>
            <p className="hero-subtext">{profile.subtext}</p>

            <div className="hero-chip-cloud">
              {heroChips.map((chip) => (
                <span key={chip} className="hero-chip">
                  {chip}
                </span>
              ))}
            </div>

            <div className="hero-actions">
              <a className="button-primary" href="#projects">
                Explore projects
              </a>
              <a className="button-secondary" href={resumeHref} target="_blank" rel="noreferrer">
                Download resume
              </a>
            </div>

            <div className="hero-metrics">
              {metrics.slice(0, 3).map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </Reveal>

          <div className="hero-visual">
            <div className="orbital-stage">
              <div className="orbital-ring orbital-ring-one" />
              <div className="orbital-ring orbital-ring-two" />
              <div className="orbital-ring orbital-ring-three" />
              <div className="visual-label visual-label-left">Creative UI energy</div>
              <div className="visual-label visual-label-right">Data-first engineering</div>

              <ProfilePrism photoHref={photoHref} placeholderHref={placeholderHref} />

              <TiltPanel className="command-card">
                <p className="mini-label">Creative signal</p>
                <h2>{profile.fullName}</h2>
                <p>
                  Web experiences, data systems, and AI-led workflows woven into one premium
                  showcase with stronger visual identity.
                </p>
                <div className="command-highlights">
                  {creativePillars.map((pillar) => (
                    <span key={pillar.title}>{pillar.title}</span>
                  ))}
                </div>
              </TiltPanel>

              <div className="floating-stat stat-top">
                <strong>{profile.education.score}</strong>
                <span>{profile.education.degree}</span>
              </div>

              <div className="floating-stat stat-right">
                <strong>Present</strong>
                <span>Data Engineer Intern at Intwo Cloud</span>
              </div>

              <div className="floating-stat stat-bottom">
                <strong>2026</strong>
                <span>Graduating with a CSE degree</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section signature-section">
          <Reveal className="signature-shell">
            <div className="signature-copy">
              <span className="eyebrow">Design signature</span>
              <h2>Front-end atmosphere, data backbone, and AI utility in one portfolio language.</h2>
              <p>
                The site now frames your resume like a premium digital identity system. It feels
                more like a creative launch page than a document translated onto the web.
              </p>
            </div>

            <div className="signature-grid">
              {creativePillars.map((pillar) => (
                <Reveal key={pillar.title}>
                  <CreativePillar pillar={pillar} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="ticker-shell" aria-label="Skills ticker">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </section>

        <section className="section" id="vision">
          <Reveal>
            <SectionHeading
              eyebrow="Creative direction"
              title="A high-end portfolio built around motion, depth, and signal."
              description="The story is shaped around your hybrid profile: part web developer, part data engineer, and part AI-focused builder. Instead of looking like a resume page, the site behaves more like a digital showcase."
            />
          </Reveal>

          <div className="vision-grid">
            <Reveal className="story-card glass-card">
              <span className="card-tag">Profile</span>
              <h3>What sets the work apart</h3>
              <p>
                You have experience on both sides of the product conversation: building user-facing
                websites and engineering the data workflows that make products smarter. That balance
                becomes the central design narrative.
              </p>
              <p>
                The site emphasizes precision, ambition, and motion so recruiters immediately feel
                that you can contribute beyond ordinary portfolio templates.
              </p>
            </Reveal>

            <TiltPanel className="glass-card insight-card">
              <span className="card-tag">Focus now</span>
              <h3>{profile.availability}</h3>
              <div className="insight-list">
                <div>
                  <strong>{profile.education.school}</strong>
                  <span>{profile.education.duration}</span>
                </div>
                <div>
                  <strong>Front-end + data</strong>
                  <span>Crafted for roles that value both product feel and engineering depth</span>
                </div>
                <div>
                  <strong>Real project range</strong>
                  <span>Dashboards, machine learning, AI systems, secure search, and CMS work</span>
                </div>
              </div>
            </TiltPanel>
          </div>

          <Reveal className="metrics-band">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </Reveal>
        </section>

        <section className="section process-section">
          <Reveal>
            <SectionHeading
              eyebrow="Build approach"
              title="More creativity, but still grounded in clarity and product thinking."
              description="The strongest creative portfolios do more than animate. They make your profile memorable, easy to understand, and convincing at a glance."
            />
          </Reveal>

          <div className="process-grid">
            {processMoments.map((item) => (
              <Reveal key={item.index}>
                <ProcessCard item={item} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" id="experience">
          <Reveal>
            <SectionHeading
              eyebrow="Experience"
              title="Hands-on exposure across product interfaces and data systems."
              description="From responsive websites to cloud-supported data workflows, each role adds a different layer to the overall portfolio story."
            />
          </Reveal>

          <div className="timeline">
            {experiences.map((item) => (
              <ExperienceCard key={`${item.company}-${item.role}`} item={item} />
            ))}
          </div>
        </section>

        <section className="section" id="projects">
          <Reveal>
            <SectionHeading
              eyebrow="Selected work"
              title="Projects designed to feel product-ready, not just technically complete."
              description="These are the projects that best show the blend of engineering, interface thinking, and problem-solving reflected in your resume."
            />
          </Reveal>

          <div className="project-grid">
            {projects.slice(0, 3).map((project) => (
              <Reveal key={project.title}>
                <ProjectCard project={project} featured />
              </Reveal>
            ))}
          </div>

          <div className="project-grid compact">
            {projects.slice(3).map((project) => (
              <Reveal key={project.title}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section" id="stack">
          <Reveal>
            <SectionHeading
              eyebrow="Capabilities"
              title="A stack shaped for modern interfaces, scalable data flow, and analytical products."
              description="Grouped by how the skills actually appear in work, rather than as a flat list of buzzwords."
            />
          </Reveal>

          <div className="stack-layout">
            <div className="skill-grid">
              {skillGroups.map((group) => (
                <Reveal key={group.title}>
                  <SkillGroup group={group} />
                </Reveal>
              ))}
            </div>

            <Reveal className="achievements-panel glass-card">
              <span className="card-tag">Wins and signals</span>
              <h3>Momentum backed by projects, internships, and execution.</h3>
              <ul>
                {achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="section contact-section" id="contact">
          <Reveal className="contact-card">
            <span className="eyebrow">Let&apos;s build something strong</span>
            <h2>Looking premium is the first impression. Building work that deserves attention is the real statement.</h2>
            <p>
              If you are hiring for front-end, data, analytics, or AI-focused roles, this portfolio
              is designed to show both taste and technical range.
            </p>

            <div className="contact-actions">
              <a className="button-primary" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a className="button-secondary" href={`tel:${profile.phone.replace(/\s+/g, "")}`}>
                {profile.phone}
              </a>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
