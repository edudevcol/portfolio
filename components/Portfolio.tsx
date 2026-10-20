import React, { useState, useEffect } from 'react';
import { INITIAL_PROJECTS, Icons } from '../constants';
import { Project } from '../types';
import ProjectModal from './ProjectModal';
import ProjectVisual from './ProjectVisual';
import AgenticPipeline from './AgenticPipeline';
import { useLanguage } from '../contexts/LanguageContext';
import { track } from '@vercel/analytics/react';

// Clave versionada: una lista guardada de antes taparía los proyectos nuevos de constants.tsx.
const CLAVE_PROYECTOS = 'portfolio_projects_v2';

const Portfolio: React.FC = () => {
  const { t } = useLanguage();
  const portfolioTranslations = t('portfolio');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'agentes' | 'herramientas'>('todos');
  // El modo admin es para el dueño: se abre con ?admin en la dirección y un reclutador no ve el botón.
  const adminDisponible = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('admin');
  
  // Admin Mode State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({});

  // Load projects from localStorage or constants
  useEffect(() => {
    const stored = localStorage.getItem(CLAVE_PROYECTOS);
    if (stored) {
      setProjects(JSON.parse(stored));
    } else {
      setProjects(INITIAL_PROJECTS);
    }
  }, []);

  // Persist changes
  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem(CLAVE_PROYECTOS, JSON.stringify(newProjects));
  };

  // CRUD Operations
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("¿Estás seguro de eliminar este proyecto?")) {
      const updated = projects.filter(p => p.id !== id);
      saveProjects(updated);
    }
  };

  const handleEditClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject({
      features: [],
      technologies: []
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!editingProject.title || !editingProject.shortDescription) return;

    const projectToSave = {
      ...editingProject,
      id: editingProject.id || Date.now().toString(),
      image: editingProject.image || "https://picsum.photos/800/600?random=" + Date.now(),
      features: editingProject.features || [],
      technologies: editingProject.technologies || [],
    } as Project;

    let updatedProjects;
    if (editingProject.id) {
      // Update existing
      updatedProjects = projects.map(p => p.id === editingProject.id ? projectToSave : p);
    } else {
      // Create new
      updatedProjects = [...projects, projectToSave];
    }

    saveProjects(updatedProjects);
    setIsEditModalOpen(false);
    setEditingProject({});
  };

  // Form helpers
  const handleTechChange = (val: string) => {
    setEditingProject(prev => ({
        ...prev,
        technologies: val.split(',').map(t => t.trim())
    }));
  };

  const handleFeaturesChange = (val: string) => {
    setEditingProject(prev => ({
        ...prev,
        features: val.split('\n').map(f => f.trim()).filter(Boolean)
    }));
  };

  return (
    <section id="portfolio" className="py-20 bg-slate-900 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{portfolioTranslations.title}</h2>
          <p className="text-slate-400 text-center">{portfolioTranslations.subtitle}</p>
          
          {/* Admin Toggle (Hidden/Small for Portfolio feel) */}
          {adminDisponible && <div className="absolute right-0 top-0 hidden md:block">
             <button 
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`text-xs px-3 py-1 rounded border ${isAdminMode ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
             >
                {isAdminMode ? 'Salir Admin' : 'Admin Mode'}
             </button>
          </div>}
        </div>

        {isAdminMode && (
            <div className="mb-8 flex justify-center">
                <button 
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-lg transition-all"
                >
                    <Icons.Plus /> Nuevo Proyecto
                </button>
            </div>
        )}

        <AgenticPipeline
          agentes={['4', '5', '6'].map(id => projects.find(p => p.id === id)).filter((p): p is Project => !!p)}
          onOpen={(p) => { track('project_viewed', { project: p.title }); setSelectedProject(p); }}
        />

        {/* Filtros por tipo de proyecto */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Filtrar proyectos">
          {([['todos', portfolioTranslations.filterAll], ['agentes', portfolioTranslations.filterAgents], ['herramientas', portfolioTranslations.filterTools]] as const).map(([clave, etiqueta]) => (
            <button
              key={clave}
              role="tab"
              aria-selected={filtro === clave}
              onClick={() => setFiltro(clave)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${filtro === clave ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-600/25' : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}`}
            >
              {etiqueta}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.filter(p => filtro === 'todos' || p.category === filtro).map((project) => (
            <div
              key={project.id}
              onClick={() => {
                // Qué proyecto abre cada visitante — la señal de qué interesa
                // de verdad, más útil que solo saber que entraron a la página.
                track('project_viewed', { project: project.title });
                setSelectedProject(project);
              }}
              className="group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-primary-500 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 cursor-pointer flex flex-col relative"
            >
              {/* Admin Actions */}
              {isAdminMode && (
                  <div className="absolute top-2 right-2 z-20 flex gap-2">
                      <button 
                        onClick={(e) => handleEditClick(e, project)}
                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded shadow-lg"
                      >
                          <Icons.Edit />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, project.id)}
                        className="p-2 bg-red-600 hover:bg-red-500 text-white rounded shadow-lg"
                      >
                          <Icons.Delete />
                      </button>
                  </div>
              )}

              <div className="relative h-48 overflow-hidden">
                <ProjectVisual project={project} className="transform group-hover:scale-110 transition-transform duration-500" />
                {project.category && (
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm border ${project.category === 'agentes' ? 'bg-primary-600/80 border-primary-400/50 text-white' : 'bg-slate-950/75 border-slate-600 text-slate-200'}`}>
                    {project.category === 'agentes' ? portfolioTranslations.filterAgents : portfolioTranslations.filterTools}
                  </span>
                )}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {portfolioTranslations.viewDetails}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {project.shortDescription}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="text-xs font-medium text-slate-500 bg-slate-900 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs font-medium text-slate-500 bg-slate-900 px-2 py-1 rounded">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View Details Modal */}
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      {/* Add/Edit Modal */}
      {isEditModalOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-white">
                          {editingProject.id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                      </h3>
                      <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                          <Icons.Close />
                      </button>
                  </div>
                  
                  <form onSubmit={handleSaveProject} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Título</label>
                          <input 
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                            value={editingProject.title || ''}
                            onChange={e => setEditingProject({...editingProject, title: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Descripción Corta</label>
                          <input 
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                            value={editingProject.shortDescription || ''}
                            onChange={e => setEditingProject({...editingProject, shortDescription: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Descripción Completa</label>
                          <textarea 
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white h-24"
                            value={editingProject.fullDescription || ''}
                            onChange={e => setEditingProject({...editingProject, fullDescription: e.target.value})}
                          />
                      </div>
                       <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">URL Repositorio</label>
                            <input 
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                                value={editingProject.repoUrl || ''}
                                onChange={e => setEditingProject({...editingProject, repoUrl: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">URL Demo</label>
                            <input 
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                                value={editingProject.demoUrl || ''}
                                onChange={e => setEditingProject({...editingProject, demoUrl: e.target.value})}
                            />
                        </div>
                       </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Imagen URL</label>
                          <input 
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                            value={editingProject.image || ''}
                            onChange={e => setEditingProject({...editingProject, image: e.target.value})}
                            placeholder="https://..."
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Tecnologías (separadas por coma)</label>
                          <input 
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                            value={editingProject.technologies?.join(', ') || ''}
                            onChange={e => handleTechChange(e.target.value)}
                            placeholder="React, Node, CSS"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-400 mb-1">Características (una por línea)</label>
                          <textarea 
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white h-24"
                            value={editingProject.features?.join('\n') || ''}
                            onChange={e => handleFeaturesChange(e.target.value)}
                            placeholder="Feature 1&#10;Feature 2"
                          />
                      </div>
                      
                      <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
                          <button 
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                          >
                              Cancelar
                          </button>
                          <button 
                            type="submit"
                            className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded font-medium transition-colors"
                          >
                              Guardar Proyecto
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </section>
  );
};

export default Portfolio;
