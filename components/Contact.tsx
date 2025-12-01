import React from 'react';
import { PROFILE } from '../constants';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-slate-850 border-t border-slate-800">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-800 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para trabajar juntos?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Actualmente estoy disponible para posiciones Full-time o proyectos freelance. 
            Si tienes un desafío de QA o Desarrollo, hablemos.
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-6">
            <a 
              href={`mailto:${PROFILE.email}`} 
              className="w-full md:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Enviar Correo
            </a>
             <a 
              href={PROFILE.linkedin} 
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              LinkedIn
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;