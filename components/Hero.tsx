import React from 'react';
import { PROFILE, Icons } from '../constants';

const Hero: React.FC = () => {
  return (
    <section id="dashboard" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center">
        
        {/* Profile Photo */}
        <div className="mb-8 relative inline-block">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-r from-primary-500 to-purple-600 mx-auto shadow-2xl">
                <img 
                    src={PROFILE.photoUrl} 
                    alt={PROFILE.name} 
                    className="w-full h-full rounded-full object-cover border-4 border-slate-900"
                />
            </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight">
          Hola, soy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-500">{PROFILE.name}</span>
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-6">
          {PROFILE.title}
        </h2>

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

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          {PROFILE.tagline} Especializado en asegurar que el software funcione perfectamente a través de automatización inteligente y código limpio.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#portfolio" className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-bold transition-all shadow-lg shadow-primary-600/25 transform hover:-translate-y-1">
            Ver Proyectos
          </a>
          <a href="#contact" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg font-bold transition-all transform hover:-translate-y-1">
            Contactar
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
