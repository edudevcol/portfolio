import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import FadeInSection from './components/FadeInSection';

function App() {
  return (
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
            <Contact />
        </FadeInSection>
      </main>

      {/* AI Assistant fixed at bottom-right */}
      <Chatbot />
    </div>
  );
}

export default App;
