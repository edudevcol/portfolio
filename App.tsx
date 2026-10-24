import React, { useEffect } from 'react';
import { avisarVisita } from './services/visita';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import ConectaMcp from './components/ConectaMcp';
import UnifiedAssistant from './components/UnifiedAssistant';
import FadeInSection from './components/FadeInSection';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";


function App() {
  // Avisa de la visita (una vez por pestaña) para que Eduardo se entere por Telegram.
  useEffect(() => { avisarVisita(); }, []);

  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-slate-900 text-slate-200">
        <Navbar />
        
        <main>
          <FadeInSection>
              <Hero />
          </FadeInSection>

          
          <FadeInSection delay="0.2s">
              <About />
          </FadeInSection>

          <FadeInSection>
              <Skills />
          </FadeInSection>

          <FadeInSection>
              <Experience />
          </FadeInSection>

          <FadeInSection>
              <Portfolio />
          </FadeInSection>

          <FadeInSection>
              <ConectaMcp />
          </FadeInSection>

          <FadeInSection>
              <Contact />
          </FadeInSection>
        </main>

        {/* AI Assistant fixed at bottom-right */}
        <UnifiedAssistant />

        <Analytics />
        <SpeedInsights />
      </div>
    </LanguageProvider>
  );
}

export default App;
