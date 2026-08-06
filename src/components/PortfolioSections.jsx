import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  ExternalLink, 
  Award, 
  Briefcase, 
  Calendar, 
  Code2, 
  Download, 
  Send, 
  FileText,
  CheckCircle2
} from 'lucide-react';

// Custom inline SVG icons for brand logos removed in Lucide v1.x
const Github = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);


export default function PortfolioSections() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSending(true);
      
      // Read Web3Forms key from Vite env variables or use fallback placeholder
      const apiKey = import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE";
      
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            access_key: apiKey,
            name: formData.name,
            email: formData.email,
            message: formData.message,
            subject: `New Portfolio Message from ${formData.name}`,
            from_name: "3D Resume Portfolio"
          })
        });

        const result = await response.json();
        
        if (result.success) {
          setSubmitted(true);
          setFormData({ name: '', email: '', message: '' });
        } else {
          alert("Failed to send message: " + result.message);
        }
      } catch (error) {
        alert("An error occurred while sending the message. Please check your connection.");
      } finally {
        setSending(false);
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* 1. Summary / Hero Section */}
      <section id="summary" className="section hero-section">
        <p className="hero-subtitle">Software Engineer & Full Stack Developer</p>
        <h1 className="hero-title">
          Hi, I am <span>Raghav Parasher</span>
        </h1>
        <p className="hero-desc">
          I didn't just choose software development; I fell in love with the magic of bringing ideas to life through code. As a Full Stack Software Engineer, I spend my time bridging the gap between robust backend architectures and highly responsive, intuitive user interfaces. I build with performance, security, and scalability in mind.
        </p>
        <div className="cta-group">
          <a href="#contact" className="btn-primary">
            Get In Touch <Mail size={18} />
          </a>
          <a href="#projects" className="btn-secondary">
            View Projects <ExternalLink size={18} />
          </a>
        </div>
      </section>

      {/* 2. Work Experience Section */}
      <section id="experience" className="section">
        <h2 className="section-title">Work Experience</h2>
        <div className="glass-card">
          <div className="timeline">
            {/* Experience 1 */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-header">
                <div>
                  <h3 className="role-title">Software Development Intern</h3>
                  <p className="company-name">Angiras Enterprises</p>
                </div>
                <span className="timeline-date">Jan — May 2026</span>
              </div>
              <ul className="timeline-bullets">
                <li>Designed, coded, and tested modular full-stack features and resolved critical platform bugs during the SDLC.</li>
                <li>Collaborated with cross-functional engineering teams using Git version control and Agile methodology.</li>
              </ul>
              <a 
                href="https://www.linkedin.com/in/raghavparasher/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-link"
                style={{ marginTop: '0.6rem', display: 'inline-flex', fontSize: '0.85rem' }}
              >
                View Internship Certificate <ExternalLink size={14} />
              </a>
            </div>

            {/* Experience 2 */}
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-header">
                <div>
                  <h3 className="role-title">Full Stack Developer Intern</h3>
                  <p className="company-name">Xebia</p>
                </div>
                <span className="timeline-date">Jun — Jul 2025</span>
              </div>
              <ul className="timeline-bullets">
                <li>Co-developed modular backend logic and designed user dashboard panels using React.js and Express.js.</li>
                <li>Resolved production code bugs and implemented requested features within sprint-based delivery schedules.</li>
              </ul>
              <a 
                href="https://www.linkedin.com/in/raghavparasher/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="project-link"
                style={{ marginTop: '0.6rem', display: 'inline-flex', fontSize: '0.85rem' }}
              >
                View Internship Certificate <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Projects Section */}
      <section id="projects" className="section">
        <h2 className="section-title">Projects</h2>
        <div className="projects-grid">
          {/* Project 1 - PulseMeet AI Platform */}
          <div className="glass-card project-card">
            <div>
              <h3>PulseMeet AI Platform</h3>
              <p className="project-desc">
                Developed an intelligent AI-powered meeting transcription, summarization, and collaboration platform. Built with TypeScript and React, integrating speech-to-text processing and LLM-powered context engineering for instant meeting intelligence.
              </p>
            </div>
            <div className="project-links">
              <a href="https://github.com/RaghavParasher/PulseMeet-AI-Platform" target="_blank" rel="noopener noreferrer" className="project-link">
                GitHub <Github size={16} />
              </a>
            </div>
          </div>

          {/* Project 2 - SkillForge Academy */}
          <div className="glass-card project-card">
            <div>
              <h3>SkillForge Academy</h3>
              <p className="project-desc">
                Built an interactive tech education and learning management platform designed to streamline course delivery, track student progress, and manage educational resources. Engineered using the MERN stack with TypeScript.
              </p>
            </div>
            <div className="project-links">
              <a href="https://github.com/RaghavParasher/skillforge-academy" target="_blank" rel="noopener noreferrer" className="project-link">
                GitHub <Github size={16} />
              </a>
            </div>
          </div>

          {/* Project 3 - Team Task Manager */}
          <div className="glass-card project-card">
            <div>
              <h3>Team Task Manager</h3>
              <p className="project-desc">
                Engineered a real-time collaborative task board using the MERN stack. Integrates JWT token authentication and role-based access control (RBAC) to allow secure team member task assignments, dashboard analytics, and collaborative workflow management.
              </p>
            </div>
            <div className="project-links">
              <a href="https://github.com/RaghavParasher/Team-Task-Manager" target="_blank" rel="noopener noreferrer" className="project-link">
                GitHub <Github size={16} />
              </a>
            </div>
          </div>

          {/* Project 4 - AI Study Buddy */}
          <div className="glass-card project-card">
            <div>
              <h3>AI Study Buddy</h3>
              <p className="project-desc">
                Developed scheduling logic to dynamically generate customized weekly study planners based on user course inputs. Integrated YouTube APIs to fetch relevant video references and structured personalized resources for an optimal learning workflow.
              </p>
            </div>
            <div className="project-links">
              <a href="https://github.com/RaghavParasher/AI-STUDY-BUDDY" target="_blank" rel="noopener noreferrer" className="project-link">
                GitHub <Github size={16} />
              </a>
            </div>
          </div>

          {/* Project 5 - Real-Time Chat Application */}
          <div className="glass-card project-card">
            <div>
              <h3>Real-Time Chat Application</h3>
              <p className="project-desc">
                Created a real-time, event-driven chat application using React, Node.js, and WebSockets (Socket.io) for instant messaging, group rooms, and dynamic active-user indicators.
              </p>
            </div>
            <div className="project-links">
              <a href="https://github.com/RaghavParasher/real-time-chat-application" target="_blank" rel="noopener noreferrer" className="project-link">
                GitHub <Github size={16} />
              </a>
            </div>
          </div>

          {/* Project 6 - Equi-Split */}
          <div className="glass-card project-card">
            <div>
              <h3>Equi-Split</h3>
              <p className="project-desc">
                Created responsive client dashboards in React to facilitate group creation, balance tracking, and bill settlements. Implemented optimized calculations for debt simplification and transaction distribution.
              </p>
            </div>
            <div className="project-links">
              <a href="https://github.com/RaghavParasher/equisplit" target="_blank" rel="noopener noreferrer" className="project-link">
                GitHub <Github size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Skills Section */}
      <section id="skills" className="section">
        <h2 className="section-title">Skills & Technologies</h2>
        <div className="glass-card skills-grid">
          {/* Languages */}
          <div className="skill-category">
            <h3>Languages</h3>
            <div className="skills-list">
              <span className="skill-badge">JavaScript (ES6+)</span>
              <span className="skill-badge">TypeScript</span>
              <span className="skill-badge">Python</span>
              <span className="skill-badge">SQL (MySQL)</span>
            </div>
          </div>

          {/* Frontend */}
          <div className="skill-category">
            <h3>Frontend</h3>
            <div className="skills-list">
              <span className="skill-badge">React.js</span>
              <span className="skill-badge">Redux</span>
              <span className="skill-badge">HTML5</span>
              <span className="skill-badge">CSS3</span>
              <span className="skill-badge">Tailwind CSS</span>
            </div>
          </div>

          {/* Backend */}
          <div className="skill-category">
            <h3>Backend</h3>
            <div className="skills-list">
              <span className="skill-badge">Node.js</span>
              <span className="skill-badge">Express.js</span>
              <span className="skill-badge">RESTful APIs</span>
              <span className="skill-badge">MVC Architecture</span>
            </div>
          </div>

          {/* Database & Tools */}
          <div className="skill-category">
            <h3>Database & Tools</h3>
            <div className="skills-list">
              <span className="skill-badge">MongoDB</span>
              <span className="skill-badge">PostgreSQL</span>
              <span className="skill-badge">MySQL</span>
              <span className="skill-badge">Docker</span>
              <span className="skill-badge">Git & GitHub</span>
              <span className="skill-badge">Postman</span>
              <span className="skill-badge">Linux</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Certifications Section */}
      <section id="certificates" className="section">
        <h2 className="section-title">Certifications</h2>
        <div className="certificates-grid">
          {/* Certificate 1 - Microsoft Azure */}
          <div className="glass-card cert-card">
            <div className="cert-icon"><Award size={20} /></div>
            <div className="cert-info">
              <span className="cert-name">Microsoft Certified: Azure Developer Associate (AZ-204)</span>
              <span className="cert-issuer">Microsoft (2025)</span>
              <a href="https://www.linkedin.com/in/raghavparasher/details/certifications/" className="cert-link" target="_blank" rel="noopener noreferrer">
                View Certificate <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Certificate 2 - JPMorgan Chase */}
          <div className="glass-card cert-card">
            <div className="cert-icon"><Award size={20} /></div>
            <div className="cert-info">
              <span className="cert-name">JPMorgan Chase - Software Engineering Job Simulation</span>
              <span className="cert-issuer">Forage (2026)</span>
              <a href="https://www.linkedin.com/in/raghavparasher/details/certifications/" className="cert-link" target="_blank" rel="noopener noreferrer">
                View Certificate <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Certificate 3 - Digital Heroes */}
          <div className="glass-card cert-card">
            <div className="cert-icon"><Award size={20} /></div>
            <div className="cert-info">
              <span className="cert-name">Full Stack Developer Training</span>
              <span className="cert-issuer">Digital Heroes (2026)</span>
              <a href="https://www.linkedin.com/in/raghavparasher/details/certifications/" className="cert-link" target="_blank" rel="noopener noreferrer">
                View Certificate <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Certificate 4 - Google Analytics */}
          <div className="glass-card cert-card">
            <div className="cert-icon"><Award size={20} /></div>
            <div className="cert-info">
              <span className="cert-name">Google Analytics Certification</span>
              <span className="cert-issuer">United Latino Students Association (2025)</span>
              <a href="https://www.linkedin.com/in/raghavparasher/details/certifications/" className="cert-link" target="_blank" rel="noopener noreferrer">
                View Certificate <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Certificate 5 - HackerRank Software Engineer */}
          <div className="glass-card cert-card">
            <div className="cert-icon"><Award size={20} /></div>
            <div className="cert-info">
              <span className="cert-name">Software Engineer Intern</span>
              <span className="cert-issuer">HackerRank (2026)</span>
              <a href="https://www.linkedin.com/in/raghavparasher/details/certifications/" className="cert-link" target="_blank" rel="noopener noreferrer">
                View Certificate <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Certificate 6 - HackerRank React */}
          <div className="glass-card cert-card">
            <div className="cert-icon"><Award size={20} /></div>
            <div className="cert-info">
              <span className="cert-name">React (Basic)</span>
              <span className="cert-issuer">HackerRank (2026)</span>
              <a href="https://www.linkedin.com/in/raghavparasher/details/certifications/" className="cert-link" target="_blank" rel="noopener noreferrer">
                View Certificate <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Certificate 7 - HackerRank JS */}
          <div className="glass-card cert-card">
            <div className="cert-icon"><Award size={20} /></div>
            <div className="cert-info">
              <span className="cert-name">JavaScript (Intermediate)</span>
              <span className="cert-issuer">HackerRank (2026)</span>
              <a href="https://www.linkedin.com/in/raghavparasher/details/certifications/" className="cert-link" target="_blank" rel="noopener noreferrer">
                View Certificate <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Certificate 8 - TCS iON */}
          <div className="glass-card cert-card">
            <div className="cert-icon"><Award size={20} /></div>
            <div className="cert-info">
              <span className="cert-name">AI Foundation Course</span>
              <span className="cert-issuer">TCS iON (2026)</span>
              <a href="https://www.linkedin.com/in/raghavparasher/details/certifications/" className="cert-link" target="_blank" rel="noopener noreferrer">
                View Certificate <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contact Section */}
      <section id="contact" className="section">
        <h2 className="section-title">Get in Touch</h2>
        <div className="glass-card contact-container">
          <div className="contact-info">
            <p className="contact-text">
              I am currently looking for new full-time software engineering and full-stack development opportunities. If you'd like to collaborate, have a question, or just want to connect, feel free to reach out!
            </p>
            <div className="contact-methods">
              <a href="mailto:raghavparashar905@gmail.com" className="contact-method">
                <div className="method-icon"><Mail size={18} /></div>
                <div className="method-details">
                  <h4>Email</h4>
                  <p>raghavparashar905@gmail.com</p>
                </div>
              </a>

              <a href="tel:+917011502359" className="contact-method">
                <div className="method-icon"><Phone size={18} /></div>
                <div className="method-details">
                  <h4>Phone</h4>
                  <p>+91 7011502359</p>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/raghavparasher" target="_blank" rel="noopener noreferrer" className="contact-method">
                <div className="method-icon"><Linkedin size={18} /></div>
                <div className="method-details">
                  <h4>LinkedIn</h4>
                  <p>linkedin.com/in/raghavparasher</p>
                </div>
              </a>

              <a href="https://github.com/RaghavParasher" target="_blank" rel="noopener noreferrer" className="contact-method">
                <div className="method-icon"><Github size={18} /></div>
                <div className="method-details">
                  <h4>GitHub</h4>
                  <p>github.com/RaghavParasher</p>
                </div>
              </a>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  className="form-input" 
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com" 
                  className="form-input" 
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..." 
                  className="form-input" 
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ alignSelf: 'flex-start' }}
                disabled={sending || submitted}
              >
                {sending ? (
                  <>Sending... <Send size={18} className="animate-spin" /></>
                ) : submitted ? (
                  <>Sent Successfully! <CheckCircle2 size={18} /></>
                ) : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>

            </form>
          </div>
        </div>
      </section>
    </>
  );
}
