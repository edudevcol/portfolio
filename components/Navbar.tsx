import React, { useState, useEffect } from 'react';
import { PROFILE } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { iniciarLlamadaAvatar } from '../services/llamadaAvatar';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navTranslations = t('nav');

  const navLinks = [
    { name: navTranslations.dashboard, href: '#dashboard' },
    { name: navTranslations.avatar, href: '#avatar', isBadge: true, alHacerClic: iniciarLlamadaAvatar },
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
                onClick={link.alHacerClic ? (e) => { e.preventDefault(); link.alHacerClic!(); } : undefined}
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

        {/* Menú móvil: botón y panel con los mismos enlaces */}
        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-slate-300 hover:text-white"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {menuAbierto && (
        <div className="md:hidden mt-3 mx-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl p-3">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    setMenuAbierto(false);
                    if (link.alHacerClic) { e.preventDefault(); link.alHacerClic(); }
                  }}
                  className={`flex items-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold uppercase tracking-wide ${
                    link.isBadge ? 'bg-primary-600/20 text-primary-300 border border-primary-500/40 my-1' : 'text-slate-200 active:bg-slate-800'
                  }`}
                >
                  {link.isBadge && <span className="w-2 h-2 rounded-full bg-primary-400 animate-ping"></span>}
                  {link.name}
                </a>
              </li>
            ))}
            <li className="px-1 pt-2">
              <button
                type="button"
                onClick={() => { setLanguage(language === 'es' ? 'en' : 'es'); setMenuAbierto(false); }}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold uppercase tracking-wide"
              >
                {language === 'es' ? '🇺🇸 English' : '🇪🇸 Español'}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;