import React from 'react';
import { EDUCATION, PROFILE, Icons } from '../constants';
import { L } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const TEXTOS = {
  es: {
    p1: <>Soy ingeniero de sistemas y llevo desde 2020 en la <strong className="text-white">Sociedad Portuaria Regional de Cartagena</strong> automatizando pruebas de aplicaciones web críticas, con pruebas funcionales y de APIs REST en metodología ágil.</>,
    p2: <>Hoy me enfoco en el <strong className="text-white">Agentic QA</strong>: construyo agentes de IA que verifican el código contra los criterios de aceptación, ejecutan las pruebas y reportan los bugs en Jira. Como también desarrollo (React, Node.js, TypeScript), construyo mis propias herramientas.</>,
    aporto: [
      ['Cubro el ciclo de QA completo', 'de los criterios de aceptación a las pruebas y al reporte en Jira, con agentes de IA.'],
      ['Construyo mis propias herramientas', 'plataformas con IA, generadores de datos y scripts, y un avatar conversacional conectado por MCP.'],
      ['Automatización con las herramientas del mercado', 'Playwright, Selenium, TestComplete y Cypress, además de flujos de pruebas por nodos al estilo n8n.'],
    ],
    descargar: 'Descargar CV (español)', formato: 'PDF de una columna, legible por sistemas de selección.', formacion: 'Formación', idiomas: 'Idiomas:', idiomasValor: 'Español (nativo) · Inglés (básico, A2)',
  },
  en: {
    p1: <>I am a systems engineer and have been at <strong className="text-white">Sociedad Portuaria Regional de Cartagena</strong> since 2020, automating tests for business-critical web applications, with functional and REST API testing in an agile methodology.</>,
    p2: <>Today I focus on <strong className="text-white">Agentic QA</strong>: I build AI agents that check the code against the acceptance criteria, run the tests and file the bugs in Jira. Since I also develop (React, Node.js, TypeScript), I build my own tools.</>,
    aporto: [
      ['I cover the full QA cycle', 'from acceptance criteria to tests and the Jira report, with AI agents.'],
      ['I build my own tools', 'AI platforms, data generators and scripts, and a conversational avatar connected through MCP.'],
      ['Automation with the market-standard tools', 'Playwright, Selenium, TestComplete and Cypress, plus node-based test flows in the style of n8n.'],
    ],
    descargar: 'Download CV (English)', formato: 'Single-column PDF, readable by applicant tracking systems.', formacion: 'Education', idiomas: 'Languages:', idiomasValor: 'Spanish (native) · English (basic, A2)',
  },
} as const;

const About: React.FC = () => {
  const { t, language } = useLanguage();
  const aboutTranslations = t('about');
  const T = TEXTOS[language];
  
  return (
    <section id="about" className="py-20 bg-slate-850">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 border-l-4 border-primary-500 pl-4">
              {aboutTranslations.title}
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-5">
              {T.p1}
            </p>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">
              {T.p2}
            </p>

            {/* Lo que aporto: tres afirmaciones, cada una con su evidencia más abajo en la página */}
            <ul className="space-y-3 mb-8">
              {T.aporto.map(([titulo, detalle]) => (
                <li key={titulo} className="flex gap-3">
                  <svg className="w-5 h-5 mt-1 shrink-0 text-primary-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" /></svg>
                  <span className="text-slate-300"><strong className="text-white">{titulo}:</strong> {detalle}</span>
                </li>
              ))}
            </ul>

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
                  href={language === 'es' ? '/Eduardo_Navarro_CV_ES.pdf' : '/Eduardo_Navarro_CV_EN.pdf'}
                  download={language === 'es' ? 'Eduardo_Navarro_CV_ES.pdf' : 'Eduardo_Navarro_CV_EN.pdf'}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" /></svg>
                  {T.descargar}
                </a>
                <p className="mt-2 text-xs text-slate-500">{T.formato}</p>
              </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
              {T.formacion}
            </h3>
            <div className="space-y-8">
              {EDUCATION.map((edu) => (
                <div key={edu.id} className="relative pl-8 border-l-2 border-slate-700 hover:border-primary-500 transition-colors">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-primary-500"></div>
                  <h4 className="text-xl font-bold text-slate-200">{L(edu.degree, language)}</h4>
                  <p className="text-primary-400">{edu.institution}</p>
                  <span className="text-sm text-slate-500">{edu.year}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 pt-6 border-t border-slate-800 text-sm text-slate-400">
              <span className="font-semibold text-slate-300">{T.idiomas}</span> {T.idiomasValor}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;