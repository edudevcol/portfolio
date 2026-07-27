import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AvatarSection from './components/AvatarSection';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import UnifiedAssistant from './components/UnifiedAssistant';
import FadeInSection from './components/FadeInSection';
import { Analytics } from "@vercel/analytics/react";


function App() {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen bg-slate-900 text-slate-200">
        <Navbar />
        
        <main>
          <FadeInSection>
              <Hero />
          </FadeInSection>

          <FadeInSection delay="0.1s">
              <AvatarSection />
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
              <Contact />
          </FadeInSection>
        </main>

        {/* AI Assistant fixed at bottom-right */}
        <UnifiedAssistant />

        <Analytics />
      </div>
    </LanguageProvider>
  );
}

export default App;
