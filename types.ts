import { ReactNode } from 'react';

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Testing' | 'AI' | 'Tools';
  icon: ReactNode; // We will pass SVG components
  level: number; // 1-100
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
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
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