import React, { useState, useEffect } from 'react';
import { Moon, Sun, Briefcase } from 'lucide-react';
import Dashboard from './pages/Dashboard';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="app-container">
        <header className="header">
          <div className="header-title">
            <Briefcase size={32} color="var(--primary)" />
            <h1>AI Recruiter</h1>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <main>
          <Dashboard />
        </main>
      </div>
    </>
  );
}

export default App;
