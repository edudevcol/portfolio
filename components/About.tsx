import React from 'react';
import { EDUCATION, PROFILE, Icons } from '../constants';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-850">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 border-l-4 border-primary-500 pl-4">
              Acerca de mí
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              Soy un profesional apasionado por la calidad del software, la automatización y la mejora continua. Me desenvuelvo tanto en QA como en desarrollo web, lo que me permite comprender el ciclo de vida completo de una aplicación. Aseguro que los productos sean robustos, escalables y confiables, combinando prácticas avanzadas de pruebas con herramientas modernas de automatización.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Actualmente, estoy explorando la intersección entre <strong>QA y la Inteligencia Artificial</strong>, utilizando LLMs para generar datos de prueba y optimizar flujos de testing.
            </p>

            <div className="flex gap-4">
              <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Icons.LinkedIn />
              </a>
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <Icons.GitHub />
              </a>
              <a href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">WhatsApp</span>
                <Icons.WhatsApp />
              </a>
            </div>
              {/* CV download button */}
              <div className="mt-6">
                <a
                  href={PROFILE.cv}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" /></svg>
                  Descargar CV
                </a>
              </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
              Formación
            </h3>
            <div className="space-y-8">
              {EDUCATION.map((edu) => (
                <div key={edu.id} className="relative pl-8 border-l-2 border-slate-700 hover:border-primary-500 transition-colors">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-primary-500"></div>
                  <h4 className="text-xl font-bold text-slate-200">{edu.degree}</h4>
                  <p className="text-primary-400">{edu.institution}</p>
                  <span className="text-sm text-slate-500">{edu.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;