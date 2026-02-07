import { useState, useEffect } from 'react';

const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'team', 'features', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section === 'hero' ? 'home' : section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, target) => {
    e.preventDefault();
    const element = document.getElementById(target === 'home' ? 'hero' : target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="floating-sidebar">
      <nav>
        <a
          href="#"
          className={activeSection === 'home' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'home')}
        >
          <i className="ri-home-4-line"></i>
          <span>Home</span>
        </a>
        <a
          href="#about"
          className={activeSection === 'about' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'about')}
        >
          <i className="ri-information-line"></i>
          <span>About</span>
        </a>
        <a
          href="#team"
          className={activeSection === 'team' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'team')}
        >
          <i className="ri-team-line"></i>
          <span>Team</span>
        </a>
        <a
          href="#features"
          className={activeSection === 'features' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'features')}
        >
          <i className="ri-star-line"></i>
          <span>Features</span>
        </a>
        <a
          href="#contact"
          className={activeSection === 'contact' ? 'active' : ''}
          onClick={(e) => handleNavClick(e, 'contact')}
        >
          <i className="ri-mail-line"></i>
          <span>Contact</span>
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
