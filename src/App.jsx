import React, { useState, useEffect } from 'react';
import Canvas3D from './components/Canvas3D';
import PortfolioSections from './components/PortfolioSections';
import { Menu, X, ArrowUpRight } from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('summary');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'summary', label: 'Summary' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 3D background scene */}
      <div className="canvas-container">
        <Canvas3D activeSection={activeSection} />
      </div>

      {/* Main interactive HTML layer overlaying the 3D scene */}
      <div className="content-layer">
        {/* Navigation Bar */}
        <nav className="navbar">
          <a href="#summary" className="nav-brand">RAGHAV PARASHER</a>
          
          <ul className="nav-links">
            {sections.map((section) => (
              <li 
                key={section.id} 
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
              >
                <a href={`#${section.id}`}>{section.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content sections containing resume details */}
        <div className="sections-container">
          <PortfolioSections />
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Raghav Parasher. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

export default App;
