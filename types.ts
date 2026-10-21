import { ReactNode } from 'react';

export interface Skill {
  name: string;
  category: 'Agentic AI' | 'Testing' | 'Desarrollo' | 'Herramientas';
  /** Qué hago con ella: solo para las del grupo destacado (Agentic AI). */
  description?: string;
  icon?: ReactNode;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  technologies: string[];
  image: string;
  repoUrl?: string;
  demoUrl?: string;
  features: string[];
  /** Para filtrar en la sección de proyectos. */
  category?: 'agentes' | 'herramientas';
  /** Ilustración propia en lugar de una captura (proyectos sin demo pública). */
  visual?: 'criterios' | 'ejecutor' | 'jira' | 'nodos' | 'avatar';
  /** Fotos extra para el detalle (además de la imagen de portada). */
  galeria?: string[];
  /** Esquema que se muestra en el detalle debajo de las fotos (cuando la portada es una foto real). */
  visualDetalle?: 'criterios' | 'ejecutor' | 'jira' | 'nodos' | 'avatar';
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  /** Texto corrido: lo lee el asistente de IA como contexto. */
  description: string;
  /** Los logros, uno por línea: lo que se ve en pantalla. */
  highlights: string[];
  /** Lo agéntico de este cargo, en un bloque propio con su etiqueta. */
  agentic?: string[];
  tags: string[];
  current?: boolean;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}