
import React, { useState } from 'react';
import { TranslationSet, Language } from '../types';

interface NavbarProps {
  currentSection: string;
  setCurrentSection: (s: string) => void;
  t: TranslationSet;
  lang: Language;
}

const Navbar: React.FC<NavbarProps> = ({ currentSection, setCurrentSection, t, lang }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.home },
    { id: 'games', label: t.games },
    { id: 'ai', label: t.ai },
    { id: 'about', label: t.about },
    { id: 'contact', label: t.contact },
    { id: 'settings', label: t.settings },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="text-2xl font-bold arcade-font text-blue-500 cursor-pointer flex items-center gap-2"
          onClick={() => setCurrentSection('home')}
        >
          <span className="bg-blue-600 text-white px-2 py-1 rounded">T</span>
          <span className="hidden sm:inline">GAMES</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-1 lg:space-x-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentSection(item.id); setIsOpen(false); }}
              className={`px-3 py-2 rounded-md transition-colors ${
                currentSection === item.id 
                  ? 'text-blue-400 bg-slate-800' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-slate-300 p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 py-4 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentSection(item.id); setIsOpen(false); }}
              className={`block w-full text-left px-4 py-3 rounded-md transition-colors ${
                currentSection === item.id 
                  ? 'text-blue-400 bg-slate-800' 
                  : 'text-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
