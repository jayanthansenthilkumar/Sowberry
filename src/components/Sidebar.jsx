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

  const navItems = [
    { id: 'home', icon: 'ri-home-4-line', label: 'Home' },
    { id: 'about', icon: 'ri-information-line', label: 'About' },
    { id: 'team', icon: 'ri-team-line', label: 'Team' },
    { id: 'features', icon: 'ri-star-line', label: 'Features' },
    { id: 'contact', icon: 'ri-mail-line', label: 'Contact' },
  ];

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-2xl p-2 flex flex-col gap-1 shadow-lg">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-300
              ${activeSection === item.id
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'text-gray-500 hover:bg-primary/10 hover:text-primary dark:text-gray-400'
              }`}
            onClick={(e) => handleNavClick(e, item.id)}
          >
            <i className={`${item.icon} text-lg`}></i>
            <span className="absolute left-14 px-3 py-1.5 rounded-lg bg-gray-800 text-white text-xs font-medium
              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
              whitespace-nowrap shadow-lg pointer-events-none">
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
