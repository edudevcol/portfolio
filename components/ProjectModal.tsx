import React from 'react';
import { Icons } from '../constants';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
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
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-800 relative">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent md:hidden"></div>
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 flex flex-col">
          <h3 className="text-3xl font-bold text-white mb-2">{project.title}</h3>
          <p className="text-primary-400 text-lg mb-6">{project.shortDescription}</p>
          
          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Descripción</h4>
            <p className="text-slate-300 leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Características</h4>
            <ul className="space-y-2">
              {project.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-slate-300 text-sm">
                  <span className="mr-2 text-primary-500">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Stack Tecnológico</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs border border-slate-700">
                  {tech}
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
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;