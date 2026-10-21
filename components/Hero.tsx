import React from 'react';
import { PROFILE, Icons } from '../constants';
import { L } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { iniciarLlamadaAvatar } from '../services/llamadaAvatar';

const Hero: React.FC = () => {
  const { t, language } = useLanguage();
  const heroTranslations = t('hero');
  return (
    <section id="dashboard" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        {/* Rejilla tenue que se desvanece hacia los bordes: da profundidad sin competir con el texto */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 72%)',
          }}
        />
      </div>

      <div className="container mx-auto px-6 text-center">
        
        {/* Profile Photo */}
        <div className="mb-8 relative inline-block">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto shadow-2xl">
                <img 
                    src={PROFILE.photoUrl} 
                    alt={`${PROFILE.name}, Agentic QA Engineer`} width={160} height={160} decoding="async" 
                    className="w-full h-full rounded-full object-cover border-4 border-slate-900"
                />
            </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
          {heroTranslations.greeting} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-500">{PROFILE.name}</span>
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-5">
          {L(PROFILE.title, language)}
        </h2>

        {/* En qué me especializo, de un vistazo */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['Agentic QA', 'Test Automation', 'AI Agents', 'Playwright'].map((chip) => (
            <span key={chip} className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-primary-400 bg-primary-500/10 border border-primary-500/30">
              {chip}
            </span>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-8">
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#0077b5] transition-all transform hover:scale-110">
                <Icons.LinkedIn />
            </a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-all transform hover:scale-110">
                <Icons.GitHub />
            </a>
            <a href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#25D366] transition-all transform hover:scale-110">
                <Icons.WhatsApp />
            </a>
        </div>

        {/* Avatar Interactive Badge */}
        <div className="mb-6">
          <button
            type="button"
            onClick={iniciarLlamadaAvatar}
            className="inline-flex max-w-full items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-800/90 border border-primary-500/40 text-slate-200 text-sm font-semibold hover:border-primary-400 hover:bg-slate-800 transition-all shadow-lg group transform hover:scale-105"
          >
            <span className="w-3 h-3 shrink-0 rounded-full bg-primary-500 animate-ping"></span>
            <span className="text-left leading-snug">{heroTranslations.avatarBadge}</span>
            <span className="shrink-0 group-hover:translate-x-1 transition-transform text-primary-400">→</span>
          </button>
        </div>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {heroTranslations.tagline}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button type="button" onClick={iniciarLlamadaAvatar} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-600/25 transform hover:-translate-y-1 flex items-center justify-center gap-2">
            <span>{heroTranslations.avatarButton}</span>
          </button>
          <a href="#portfolio" className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold transition-all transform hover:-translate-y-1">
            {heroTranslations.portfolioButton}
          </a>
          <a href="#contact" className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl font-bold transition-all transform hover:-translate-y-1">
            {heroTranslations.contactButton}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
