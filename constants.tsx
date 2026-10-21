import React from 'react';
import { Project, Skill, Experience, Education, L } from './types';

// --- ICONS (Inline SVGs for portability) ---
export const Icons = {
  Code: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  Bug: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h.01M12 14h.01M12 11h.01M12 8h.01M7 20h4a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>,
  Database: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  Terminal: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Cpu: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>,
  GitHub: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>,
  LinkedIn: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>,
  WhatsApp: () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Send: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Robot: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Delete: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Sparkles: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  Bot: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  Volume: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>,
  VolumeMute: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>,
  Play: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>,
  Pause: () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>,
  User: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Wand: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.605 15.12a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
};

// --- PROFILE INFO ---
export const PROFILE = {
  name: "Eduardo Navarro",
  title: { es: "Agentic QA Engineer · Automatización de pruebas · Full Stack Developer", en: "Agentic QA Engineer · Test Automation · Full Stack Developer" },
  tagline: { es: "Construyo agentes de IA que hacen el trabajo de QA: verifican que el código cumpla lo que se pidió, ejecutan las pruebas y reportan los bugs en Jira.", en: "I build AI agents that do the QA work: they check that the code meets what was requested, run the tests and file the bugs in Jira." },
  email: "edudevcol@gmail.com",
  github: "https://github.com/edudevcol",
  linkedin: "https://www.linkedin.com/in/eduardonavarroecheverria",
  whatsapp: "https://wa.me/+573001244352",
  location: "Cartagena, Colombia",
  telefono: "+57 3001244352",
  photoUrl: "/foto-portfolio.jpg",
  cv: "/EDUARDONAVARRO2025_CV.pdf"
};

// --- SKILLS ---
// Agrupadas por lo que hago con ellas, con Agentic AI primero. Sin barras de porcentaje: un 50 % en Python resta y
// un 90 % en otra no demuestra nada; los proyectos de abajo son la prueba.
export const SKILLS: Skill[] = [
  // Agentic AI — el grupo destacado, cada una respaldada por un proyecto
  { name: { es: "Agentes de IA autónomos", en: "Autonomous AI agents" }, category: "Agentic AI", icon: <Icons.Robot />, description: { es: "Agentes que verifican el código contra los criterios de aceptación, ejecutan las pruebas y reportan los bugs en Jira.", en: "Agents that check the code against acceptance criteria, run the tests and file the bugs in Jira." } },
  { name: "MCP (Model Context Protocol)", category: "Agentic AI", icon: <Icons.Cpu />, description: { es: "Conecto herramientas y servicios externos a un agente sin escribir integraciones a mano.", en: "I connect external tools and services to an agent without hand-writing integrations." } },
  { name: { es: "Agentes de voz en tiempo real", en: "Real-time voice agents" }, category: "Agentic AI", icon: <Icons.Volume />, description: { es: "Gemini Live API y WebSocket: un avatar que conversa, usa herramientas y pide confirmación antes de actuar.", en: "Gemini Live API and WebSocket: an avatar that talks, uses tools and asks for confirmation before acting." } },
  { name: { es: "Flujos de pruebas por nodos", en: "Node-based test flows" }, category: "Agentic AI", icon: <Icons.Wand />, description: { es: "Pruebas encadenadas arrastrando nodos, al estilo n8n, sin escribir el orquestador.", en: "Tests chained by dragging nodes, n8n style, without writing the orchestrator." } },
  { name: "LLMs (Claude, Gemini, GPT, OpenAI)", category: "Agentic AI", icon: <Icons.Sparkles />, description: { es: "Generación de casos de prueba, datos sintéticos y scripts E2E desde lenguaje natural.", en: "Test case, synthetic data and E2E script generation from natural language." } },

  { name: "Playwright", category: "Testing" },
  { name: "Cypress", category: "Testing" },
  { name: "TestComplete", category: "Testing" },
  { name: "Selenium WebDriver", category: "Testing" },
  { name: "Postman", category: "Testing" },
  { name: { es: "Pruebas funcionales", en: "Functional testing" }, category: "Testing" },
  { name: { es: "Pruebas de APIs REST", en: "REST API testing" }, category: "Testing" },

  { name: "TypeScript / JavaScript", category: "Desarrollo" },
  { name: "React", category: "Desarrollo" },
  { name: "Node.js", category: "Desarrollo" },
  { name: "Express", category: "Desarrollo" },
  { name: "Java", category: "Desarrollo" },
  { name: "SQL", category: "Desarrollo" },
  { name: "MongoDB", category: "Desarrollo" },
  { name: "Python", category: "Desarrollo" },

  { name: "Jira", category: "Herramientas" },
  { name: "Confluence", category: "Herramientas" },
  { name: { es: "Metodologías ágiles (SCRUM)", en: "Agile methods (SCRUM)" }, category: "Herramientas" },
  { name: "Git", category: "Herramientas" },
  { name: "Docker", category: "Herramientas" },
];

// --- PROJECTS ---
export const INITIAL_PROJECTS: Project[] = [
  // ── Agentic QA: agentes de IA que cubren el ciclo de pruebas ──
  {
    id: "4",
    title: { es: "Cazador de Bugs", en: "Cazador de Bugs (Bug Hunter)" },
    shortDescription: { es: "Agente verificador: cruza el código entregado por el desarrollador contra los criterios de aceptación.", en: "Verification agent: checks the code delivered by the developer against the acceptance criteria." },
    fullDescription: { es: "Creé un agente de IA que toma el código fuente entregado por el desarrollador y lo cruza contra la documentación de los criterios de aceptación. Así se verifica si el desarrollo incluye lo que realmente se pidió. Lo desarrollé en la Sociedad Portuaria Regional de Cartagena.", en: "I built an AI agent that takes the source code delivered by the developer and checks it against the acceptance criteria documentation, to verify that the development includes what was actually requested. I built it at Sociedad Portuaria Regional de Cartagena." },
    technologies: [
      { es: "Agentes de IA", en: "AI agents" },
      { es: "Criterios de aceptación", en: "Acceptance criteria" },
      { es: "Análisis de código", en: "Code analysis" }
    ],
    image: "",
    category: "agentes",
    visual: "criterios",
    features: [
      { es: "Lee el código fuente entregado por el desarrollador", en: "Reads the source code delivered by the developer" },
      { es: "Lo contrasta con la documentación de criterios de aceptación", en: "Checks it against the acceptance criteria documentation" },
      { es: "Verifica si el desarrollo incluye lo que se pidió", en: "Verifies that the development includes what was requested" }
    ]
  },
  {
    id: "5",
    title: { es: "Agente Ejecutor de Pruebas Autónomo", en: "Autonomous Test Execution Agent" },
    shortDescription: { es: "Agente de IA que ejecuta las pruebas de forma autónoma.", en: "AI agent that runs the tests autonomously." },
    fullDescription: { es: "Creé un agente de IA que ejecuta las pruebas de forma autónoma. Es una pieza del flujo de agentes de QA: uno verifica el desarrollo, este ejecuta las pruebas y otro reporta el resultado. Lo desarrollé en la Sociedad Portuaria Regional de Cartagena.", en: "I built an AI agent that runs the tests autonomously. It is one piece of the QA agent workflow: one verifies the development, this one runs the tests and another reports the result. I built it at Sociedad Portuaria Regional de Cartagena." },
    technologies: [
      { es: "Agentes de IA", en: "AI agents" },
      { es: "Ejecución autónoma", en: "Autonomous execution" },
      { es: "Automatización de pruebas", en: "Test automation" }
    ],
    image: "",
    category: "agentes",
    visual: "ejecutor",
    features: [
      { es: "Ejecuta las pruebas de forma autónoma", en: "Runs the tests autonomously" },
      { es: "Trabaja junto a los demás agentes del flujo de QA", en: "Works alongside the other agents in the QA workflow" }
    ]
  },
  {
    id: "6",
    title: { es: "Agente Reportador de Bugs en Jira", en: "Jira Bug Reporting Agent" },
    shortDescription: { es: "Agente de IA que reporta en Jira, de forma autónoma, los casos de prueba y los bugs con sus correcciones.", en: "AI agent that autonomously files test cases and bugs, with their fixes, in Jira." },
    fullDescription: { es: "Creé un agente de IA que reporta de forma autónoma los casos de prueba en Jira, junto con los bugs encontrados y sus correcciones. Cierra el flujo de agentes de QA: lo verificado y ejecutado queda registrado sin trabajo manual. Lo desarrollé en la Sociedad Portuaria Regional de Cartagena.", en: "I built an AI agent that autonomously files test cases in Jira, together with the bugs found and their fixes. It closes the QA agent workflow: what was verified and run gets recorded without manual work. I built it at Sociedad Portuaria Regional de Cartagena." },
    technologies: [
      { es: "Agentes de IA", en: "AI agents" },
      "Jira"
    ],
    image: "",
    category: "agentes",
    visual: "jira",
    features: [
      { es: "Reporta los casos de prueba en Jira", en: "Files the test cases in Jira" },
      { es: "Reporta los bugs encontrados y sus correcciones", en: "Files the bugs found and their fixes" },
      { es: "Lo hace de forma autónoma", en: "Does it autonomously" }
    ]
  },
  {
    id: "7",
    title: "Playwright Workflow Builder",
    shortDescription: { es: "Constructor visual de pruebas al estilo n8n: se arman arrastrando nodos y conectándolos.", en: "Visual test builder, n8n style: tests are built by dragging and connecting nodes." },
    fullDescription: { es: "Creé una herramienta para construir pruebas de forma visual, al estilo n8n: cada prueba —por ejemplo, hacer login o ingresar al carrito— es un nodo. Se arrastra, se conecta con otro nodo y así se encadenan muchas pruebas en un solo flujo. Lo desarrollé en la Sociedad Portuaria Regional de Cartagena.", en: "I built a tool to create tests visually, n8n style: each test —for example logging in or adding to the cart— is a node. You drag it, connect it to another node and chain many tests into a single flow. I built it at Sociedad Portuaria Regional de Cartagena." },
    technologies: [
      "Playwright",
      { es: "Editor de nodos", en: "Node editor" },
      { es: "Flujos encadenados", en: "Chained flows" },
      { es: "Sin código", en: "No-code" }
    ],
    image: "",
    category: "herramientas",
    visual: "nodos",
    features: [
      { es: "Cada prueba es un nodo que se arrastra al lienzo", en: "Each test is a node dragged onto the canvas" },
      { es: "Los nodos se conectan entre sí para encadenar pruebas", en: "Nodes connect to each other to chain tests" },
      { es: "Permite armar escenarios largos sin escribir el orquestador a mano", en: "Lets you build long scenarios without hand-writing the orchestrator" }
    ]
  },
  // ── Proyecto destacado: el avatar con el que estás hablando ──
  {
    id: "8",
    title: { es: "Avatar Conversacional con IA", en: "Conversational AI Avatar" },
    shortDescription: { es: "Asistente de voz con avatar 3D realista, conectado a múltiples servidores MCP y a Google Workspace.", en: "Voice assistant with a realistic 3D avatar, connected to multiple MCP servers and Google Workspace." },
    fullDescription: { es: "Asistente de voz con avatar 3D realista y sincronización labial en tiempo real, conectado a decenas de herramientas: Gmail, Google Calendar, Contactos, Drive y Tasks, además de servidores MCP de terceros que se enchufan sin escribir código. Es voz primero: funciona por teléfono y en reloj inteligente, sin depender de una pantalla. Tiene una arquitectura de seguridad propia: las acciones que salen hacia afuera (enviar un correo, borrar un evento) exigen confirmación hablada y nunca se ejecutan a ciegas, y el asistente jamás inventa un dato cuando una herramienta falla.", en: "Voice assistant with a realistic 3D avatar and real-time lip sync, connected to dozens of tools: Gmail, Google Calendar, Contacts, Drive and Tasks, plus third-party MCP servers that plug in without writing code. It is voice-first: it works by phone and on a smartwatch, without depending on a screen. It has its own security architecture: actions that go out to the world (sending an email, deleting an event) require spoken confirmation and are never executed blindly, and the assistant never makes up data when a tool fails." },
    technologies: ["React", "Node.js", "TypeScript", "Gemini Live API", "WebSocket", "MCP", "Google Workspace APIs"],
    image: "/avatar-holograma.jpg",
    galeria: ["/avatar-holograma.jpg"],
    visualDetalle: "avatar",
    demoUrl: "https://cv.edudev.biz",
    category: "agentes",
    features: [
      { es: "Avatar 3D con sincronización labial en tiempo real", en: "3D avatar with real-time lip sync" },
      { es: "Conectado a múltiples servidores MCP y a Gmail, Calendar, Contactos, Drive y Tasks", en: "Connected to multiple MCP servers and to Gmail, Calendar, Contacts, Drive and Tasks" },
      { es: "Funciona por teléfono y en reloj inteligente", en: "Works by phone and on a smartwatch" },
      { es: "Las acciones sensibles piden confirmación hablada antes de ejecutarse", en: "Sensitive actions ask for spoken confirmation before running" },
      { es: "Nunca inventa un dato cuando una herramienta falla", en: "Never makes up data when a tool fails" }
    ]
  },
  // ── Herramientas con demo pública ──
  {
    id: "1",
    title: "AI Test Case Generator",
    shortDescription: { es: "Generador automático de casos de prueba impulsado por IA y exportación a Jira.", en: "Automatic AI-powered test case generator with export to Jira." },
    fullDescription: { es: "Aplicación que permite a equipos de QA generar casos de prueba detallados a partir de requisitos o historias de usuario utilizando modelos LLM. Reduce el tiempo de análisis manual y garantiza una mejor cobertura funcional.", en: "Application that lets QA teams generate detailed test cases from requirements or user stories using LLM models. It reduces manual analysis time and ensures better functional coverage." },
    technologies: ["React", "Jira", "Gemini AI", "Express", "Node.js"],
    image: "./ai-test-case-generator.png",
    category: "herramientas",
    demoUrl: "https://ai-test-cases-generator-bay.vercel.app",
    repoUrl: "https://github.com/edudevcol/ai-test-cases-generator",
    features: [
      { es: "Generación de casos de prueba funcionales", en: "Functional test case generation" },
      { es: "Derivación de escenarios alternos", en: "Derivation of alternate scenarios" },
      { es: "Exportación automática a Jira", en: "Automatic export to Jira" },
      { es: "Clasificación por prioridad y tipo de prueba", en: "Classification by priority and test type" }
    ]
  },
  {
    id: "2",
    title: "AI Script Generator Playwright",
    shortDescription: { es: "Generador inteligente de scripts automatizados usando Playwright y modelos LLM.", en: "Smart generator of automated scripts using Playwright and LLM models." },
    fullDescription: { es: "Una herramienta impulsada por IA que genera scripts de automatización Playwright basados en descripciones en lenguaje natural. Ideal para testers que quieren acelerar la creación de casos de prueba E2E sin escribir código desde cero.", en: "An AI-powered tool that generates Playwright automation scripts from natural-language descriptions. Ideal for testers who want to speed up E2E test creation without writing code from scratch." },
    technologies: ["Playwright", "TypeScript", "LLM", "OpenAI/Gemini"],
    image: "./playwright.png",
    category: "herramientas",
    demoUrl: "https://playwright-ai-wlz9.vercel.app",
    repoUrl: "https://github.com/edudevcol/playwright-ai",
    features: [
      { es: "Generación automática de scripts", en: "Automatic script generation" },
      { es: "Conversión de texto a pasos E2E", en: "Text-to-E2E-steps conversion" },
      { es: "Integración con Page Object Model", en: "Page Object Model integration" },
      { es: "Sugerencias inteligentes de selectores", en: "Smart selector suggestions" }
    ]
  }, {
    id: "3",
    title: "AI Test Data Generator",
    shortDescription: { es: "Generador de datos de prueba sintéticos utilizando modelos LLM.", en: "Synthetic test data generator using LLM models." },
    fullDescription: { es: "Una aplicación full-stack que permite a los equipos de QA generar grandes volúmenes de datos de prueba realistas pero anónimos utilizando la API de Gemini. Resuelve el problema de la privacidad de datos en entornos de staging.", en: "A full-stack application that lets QA teams generate large volumes of realistic yet anonymous test data using the Gemini API. It solves the data-privacy problem in staging environments." },
    technologies: ["React", "Node.js", "Gemini AI", "JSON"],
    image: "./tdm.png",
    category: "herramientas",
    demoUrl: "https://tdm-generator-ai.vercel.app",
    repoUrl: "https://github.com/edudevcol/tdm-generator-ai",
    features: [
      { es: "Generación de JSON/CSV", en: "JSON/CSV generation" },
      { es: "Schemas personalizables", en: "Customizable schemas" },
      { es: "Validación de tipos de datos", en: "Data type validation" },
      { es: "Exportación masiva", en: "Bulk export" }
    ]
  }

];

// --- EXPERIENCE ---
export const EXPERIENCE: Experience[] = [
  {
    id: "1",
    role: "Senior QA Automation Engineer",
    company: "Sociedad Portuaria Regional de Cartagena",
    period: { es: "2020 - Presente", en: "2020 - Present" },
    current: true,
    highlights: [
      { es: "Diseño e implemento automatización de pruebas con Selenium, Playwright y TestComplete para aplicaciones web críticas, con pruebas funcionales y de APIs REST en metodología ágil (SCRUM).", en: "Design and implement test automation with Selenium, Playwright and TestComplete for business-critical web applications, including functional and REST API tests, working in agile (SCRUM)." },
      { es: "Lidero el desarrollo de una plataforma con IA que genera casos de prueba y criterios de aceptación y los documenta en Jira y Confluence.", en: "Lead the development of an AI platform that generates test cases and acceptance criteria and documents them in Jira and Confluence." },
      { es: "Desarrollé una herramienta de datos sintéticos con LLMs que resuelve problemas de privacidad y optimiza los entornos de staging.", en: "Built a synthetic-data tool with LLMs that addresses privacy concerns and improves staging environments." },
      { es: "Construí una aplicación web que transforma casos de prueba escritos en lenguaje natural en scripts automatizados listos para ejecutar.", en: "Built a web application that turns test cases written in natural language into ready-to-run automated scripts." }
    ],
    agentic: [
      { es: "Cazador de Bugs: agente de IA que cruza el código entregado por el desarrollador contra los criterios de aceptación y verifica si lo desarrollado incluye lo que se pidió.", en: "Cazador de Bugs (Bug Hunter): an AI agent that checks the code delivered by the developer against the acceptance criteria and verifies that what was built includes what was requested." },
      { es: "Agente ejecutor: ejecuta las pruebas de forma autónoma.", en: "Execution agent: runs the tests autonomously." },
      { es: "Agente reportador: reporta en Jira, de forma autónoma, los casos de prueba y los bugs con sus correcciones.", en: "Reporting agent: autonomously files test cases and bugs, with their fixes, in Jira." },
      { es: "Playwright Workflow Builder: las pruebas se arman arrastrando nodos al estilo n8n (por ejemplo, login o ingresar al carrito) y se encadenan en un solo flujo.", en: "Playwright Workflow Builder: tests are built by dragging nodes, n8n style (for example login or adding to the cart), and chained into a single flow." },
      { es: "Chatbot que ejecuta pruebas automatizadas con Playwright mediante lenguaje natural.", en: "Chatbot that runs automated Playwright tests from natural language." },
      { es: "MCP (Model Context Protocol) con Playwright para pruebas inteligentes y autónomas.", en: "MCP (Model Context Protocol) with Playwright for intelligent, autonomous testing." }
    ],
    tags: [
      "Claude",
      { es: "Agentes de IA", en: "AI agents" },
      "Selenium",
      "Playwright",
      "TestComplete",
      "Postman",
      "Jira",
      "Confluence",
      "SCRUM",
      "LLMs"
    ],
    description: { es: "En la Sociedad Portuaria desarrollé un flujo de agentes de QA: el Cazador de Bugs cruza el código entregado por el desarrollador contra los criterios de aceptación para verificar si incluye lo que se pidió, otro agente ejecuta las pruebas de forma autónoma y otro reporta en Jira, también de forma autónoma, los casos de prueba y los bugs con sus correcciones. También construí el Playwright Workflow Builder, donde las pruebas se arman arrastrando nodos al estilo n8n y se encadenan en un solo flujo. Diseño e implemento soluciones de automatización de pruebas con Selenium y Playwright para garantizar la calidad de aplicaciones web críticas, a la vez que lidero el desarrollo de una plataforma con inteligencia artificial capaz de generar automáticamente casos de prueba, criterios de aceptación y documentarlos directamente en Jira y Confluence. Además, desarrollé una herramienta de generación de datos sintéticos basada en modelos LLM que resuelve problemas de privacidad y optimiza los entornos de staging, y construí una aplicación web que transforma casos de prueba redactados en lenguaje natural en scripts automatizados listos para ejecutar mediante el uso de IA generativa.", en: "At Sociedad Portuaria I built a QA agent workflow: the Bug Hunter (Cazador de Bugs) checks the code delivered by the developer against the acceptance criteria to verify that it includes what was requested, another agent runs the tests autonomously and another autonomously files in Jira the test cases and the bugs with their fixes. I also built the Playwright Workflow Builder, where tests are assembled by dragging nodes, n8n style, and chained into a single flow. I design and implement test automation with Selenium, Playwright and TestComplete to guarantee the quality of business-critical web applications, and I lead the development of an AI platform that automatically generates test cases and acceptance criteria and documents them directly in Jira and Confluence. I also built a synthetic-data generation tool based on LLM models that solves privacy problems and improves staging environments, and a web application that turns test cases written in natural language into ready-to-run automated scripts using generative AI." }
  },
  {
    id: "2",
    role: { es: "Analista de Sistemas", en: "Systems Analyst" },
    company: "Calzado Latino",
    period: { es: "2017 - 2019", en: "2017 - 2019" },
    highlights: [
      { es: "Desarrollé funcionalidades de escritorio en VB .Net y gestioné bases de datos en SQL Server.", en: "Developed desktop features in VB .Net and managed SQL Server databases." },
      { es: "Di soporte técnico (Helpdesk) a usuarios internos: incidencias de hardware, software y aplicaciones corporativas.", en: "Provided internal Helpdesk support: hardware, software and corporate application incidents." },
      { es: "Elaboré reportes y automatizaciones en Excel con macros y VBA que optimizaron tareas repetitivas en distintas áreas.", en: "Built reports and Excel automations with macros and VBA that streamlined repetitive tasks across areas." }
    ],
    tags: ["VB .Net", "SQL Server", "VBA", "Excel", "Helpdesk"],
    description: { es: "Desarrollé funcionalidades en entornos de escritorio utilizando VB .Net y gestioné bases de datos con SQL Server. Brindé soporte técnico (Helpdesk) a usuarios internos, resolviendo incidencias de hardware, software y aplicaciones corporativas. Elaboré reportes y automatizaciones en Excel mediante macros y VBA, optimizando tareas repetitivas en distintas áreas de la organización. Trabajé con herramientas del ecosistema Microsoft Office en diversas actividades administrativas y de análisis.", en: "I developed features in desktop environments using VB .Net and managed databases with SQL Server. I provided technical support (Helpdesk) to internal users, resolving hardware, software and corporate system incidents. I built reports and automations in Excel with macros and VBA, streamlining repetitive tasks across different areas of the organization. I worked with the Microsoft Office ecosystem in a variety of administrative and analysis activities." }
  }
];

// --- EDUCATION ---
export const EDUCATION: Education[] = [
  {
    id: "1",
    degree: { es: "Ingeniería en Sistemas", en: "Systems Engineering" },
    institution: "Universidad de Cartagena",
    year: "2016"
  },
  {
    id: "2",
    degree: { es: "Full Stack Developer Web (TypeScript/JS, React, Node.js, Express, MongoDB, SQL, Java)", en: "Full Stack Web Developer (TypeScript/JS, React, Node.js, Express, MongoDB, SQL, Java)" },
    institution: "Bootcamp Coderhouse",
    year: "2024"
  }
];

// --- AI CONTEXT ---
// This string is fed to the LLM to answer questions about the portfolio owner.
export const RESUME_CONTEXT = `
Eres un asistente de IA útil y profesional encargado de responder preguntas sobre el perfil profesional de ${PROFILE.name}.
Usa la siguiente información como contexto y fuente de verdad. Si te preguntan algo que no está aquí, di amablemente que no tienes esa información específica pero ofrece contactar a ${PROFILE.name} a través del formulario.

Perfil: ${L(PROFILE.title, 'es')}.
Resumen: ${L(PROFILE.tagline, 'es')}.
Ubicación: ${PROFILE.location}.

Habilidades Técnicas:
${SKILLS.map(s => `- ${L(s.name, 'es')} (${s.category})`).join('\n')}

Experiencia Laboral:
${EXPERIENCE.map(e => `- ${L(e.role, 'es')} en ${e.company} (${L(e.period, 'es')}): ${L(e.description, 'es')}`).join('\n')}

Educación:
${EDUCATION.map(e => `- ${L(e.degree, 'es')} en ${e.institution} (${e.year})`).join('\n')}

Proyectos Destacados:
${INITIAL_PROJECTS.map(p => `- ${L(p.title, 'es')}: ${L(p.shortDescription, 'es')} (Tecnologías: ${p.technologies.map(t => L(t, 'es')).join(', ')})`).join('\n')}

Datos de Contacto:
- Email: ${PROFILE.email}
- LinkedIn: ${PROFILE.linkedin}
- GitHub: ${PROFILE.github}
- WhatsApp: ${PROFILE.whatsapp}
- Teléfono: ${PROFILE.telefono}

Estilo de respuesta: Sé conciso, breve, profesional pero amable. Habla en primera persona del singular (ej: "Yo tengo experiencia en..."). El objetivo es que el reclutador se interese en contratarte (Eres Eduardo Navarro). Responde solo texto plano.
`;