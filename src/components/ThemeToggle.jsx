import { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark-theme') {
      setIsDarkTheme(true);
      document.body.classList.add('dark-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);

    if (newTheme) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 w-11 h-11 rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
        border border-white/20 dark:border-gray-700/30 shadow-lg flex items-center justify-center
        text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-pointer"
    >
      <i className={isDarkTheme ? 'ri-moon-line text-lg' : 'ri-sun-line text-lg'}></i>
    </button>
  );
};

export default ThemeToggle;
