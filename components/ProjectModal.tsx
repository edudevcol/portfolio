import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icons } from '../constants';
import { Project, L } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import ProjectVisual from './ProjectVisual';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ETIQUETAS = {
  es: { descripcion: 'Descripción', caracteristicas: 'Características', stack: 'Stack Tecnológico', demo: 'Demo en vivo' },
  en: { descripcion: 'Description', caracteristicas: 'Features', stack: 'Tech Stack', demo: '{etiquetas.demo}' },
} as const;

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const { language } = useLanguage();
  const etiquetas = ETIQUETAS[language];
  // Escape cierra el modal
  useEffect(() => {
    if (!project) return;
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [project, onClose]);

  if (!project) return null;

  // Va a document.body: dentro de FadeInSection (que lleva `transform`) un `fixed` se posiciona respecto a la
  // sección y no a la pantalla, y el modal salía centrado fuera de lo que el visitante estaba viendo.
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-slate-900 rounded-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-full hover:bg-slate-800 transition-colors z-10"
        >
          <Icons.Close />
        </button>

        {/* Image Section */}
        <div className={`w-full md:w-1/2 ${project.galeria ? '' : 'h-64'} md:h-auto bg-slate-800 relative`}>
          {project.galeria ? (
            // Fotos reales del producto arriba y, debajo, el esquema de cómo se conecta
            <div className="w-full h-full flex flex-col bg-slate-950">
              <div className={`grid ${project.galeria.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-px bg-slate-800`}>
                {project.galeria.map((src, i) => (
                  <img key={i} src={src} alt={`${project.title} ${i + 1}`} className={`w-full object-cover ${project.galeria.length > 1 ? 'aspect-square' : 'aspect-[4/3]'}`} />
                ))}
              </div>
              {project.visualDetalle && (
                <div className="w-full aspect-[5/3]"><ProjectVisual project={{ ...project, visual: project.visualDetalle }} /></div>
              )}
            </div>
          ) : project.visual ? (
            // Las ilustraciones se muestran completas, con su proporción, en vez de recortarlas al alto del panel
            <div className="w-full h-full flex items-center bg-slate-950">
              <div className="w-full aspect-[5/3]"><ProjectVisual project={project} /></div>
            </div>
          ) : (
            <ProjectVisual project={project} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent md:hidden"></div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <h3 className="text-3xl font-bold text-white mb-2">{L(project.title, language)}</h3>
          <p className="text-primary-400 text-lg mb-6">{L(project.shortDescription, language)}</p>
          
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{etiquetas.descripcion}</h4>
            <p className="text-slate-300 leading-relaxed">
              {L(project.fullDescription, language)}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{etiquetas.caracteristicas}</h4>
            <ul className="space-y-2">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-slate-300 text-sm">
                  <span className="mr-2 text-primary-500">•</span>
                  {L(feature, language)}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{etiquetas.stack}</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs border border-slate-700">
                  {L(tech, language)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto flex gap-4">
            {project.repoUrl && (
              <a 
                href={project.repoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 py-3 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
              >
                <Icons.GitHub /> Repo
              </a>
            )}
            {project.demoUrl && (
              <a 
                href={project.demoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 py-3 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors shadow-lg shadow-primary-600/20"
              >
                {etiquetas.demo}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProjectModal;