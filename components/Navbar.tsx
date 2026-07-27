import React, { useState, useEffect } from 'react';
import { PROFILE } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navTranslations = t('nav');

  const navLinks = [
    { name: navTranslations.dashboard, href: '#dashboard' },
    { name: navTranslations.avatar, href: '#avatar', isBadge: true },
    { name: navTranslations.about, href: '#about' },
    { name: navTranslations.skills, href: '#skills' },
    { name: navTranslations.resume, href: '#experience' },
    { name: navTranslations.portfolio, href: '#portfolio' },
    { name: navTranslations.contact, href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold text-primary-400 tracking-tighter">
          {"edu".replace(' ', '').toLowerCase()}<span className="text-white">dev</span>
        </a>
        
        <ul className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.href} 
                className={`text-sm font-medium transition-all uppercase tracking-wide flex items-center gap-1.5 ${
                  link.isBadge
                    ? 'px-3 py-1.5 rounded-full bg-primary-600/20 border border-primary-500/50 text-primary-300 hover:bg-primary-600 hover:text-white shadow-md shadow-primary-600/20 font-bold'
                    : 'text-slate-300 hover:text-primary-400'
                }`}
              >
                {link.isBadge && <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping"></span>}
                {link.name}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
              className="text-sm font-medium transition-all uppercase tracking-wide px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              {language === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button (Placeholder for brevity, functional on desktop) */}
        <button className="md:hidden text-slate-300 hover:text-white">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;