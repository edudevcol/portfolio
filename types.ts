import { ReactNode } from 'react';

/** Texto en un solo idioma, o con las dos versiones; `L` elige según el idioma activo. */
export type Bilingual = string | { es: string; en: string };
export const L = (x: Bilingual, lang: 'es' | 'en'): string => (typeof x === 'string' ? x : x[lang]);

export interface Skill {
  name: Bilingual;
  category: 'Agentic AI' | 'Testing' | 'Desarrollo' | 'Herramientas';
  /** Qué hago con ella: solo para las del grupo destacado (Agentic AI). */
  description?: Bilingual;
  icon?: ReactNode;
}

export interface Project {
  id: string;
  title: Bilingual;
  shortDescription: Bilingual;
  fullDescription: Bilingual;
  technologies: Bilingual[];
  image: string;
  repoUrl?: string;
  demoUrl?: string;
  features: Bilingual[];
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
  role: Bilingual;
  company: string;
  period: Bilingual;
  /** Texto corrido: lo lee el asistente de IA como contexto. */
  description: Bilingual;
  /** Los logros, uno por línea: lo que se ve en pantalla. */
  highlights: Bilingual[];
  /** Lo agéntico de este cargo, en un bloque propio con su etiqueta. */
  agentic?: Bilingual[];
  tags: Bilingual[];
  current?: boolean;
}

export interface Education {
  id: string;
  degree: Bilingual;
  institution: string;
  year: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}