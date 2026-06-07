import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { HeroSection } from './components/HeroSection';
import { MainAppSection } from './components/MainAppSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SocialProofStrip } from './components/SocialProofStrip';
import { Routes, Route } from 'react-router-dom';
import { Convert } from './pages/Convert';
import { Result } from './pages/Result';
import { Dashboard } from './pages/Dashboard';

function Landing() {
  const mainAppRef = useRef<HTMLDivElement>(null);

  const scrollToApp = () => {
    mainAppRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HeroSection onStartClick={scrollToApp} />
      <MainAppSection ref={mainAppRef} />
      <HowItWorksSection />
      <SocialProofStrip />
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-50 selection:bg-cyan-500/30">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/convert" element={<Convert />} />
        <Route path="/result" element={<Result />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-20px" });

  return (
    <motion.footer 
      ref={footerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="py-8 text-center text-slate-500"
    >
      <p>AppForge © 2026 — Free. Open. Yours.</p>
    </motion.footer>
  );
}

export default App;
