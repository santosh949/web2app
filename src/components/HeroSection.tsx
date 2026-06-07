import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface HeroSectionProps {
  onStartClick: () => void;
}

export function HeroSection({ onStartClick }: HeroSectionProps) {
  // Parallax Scroll logic
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  // Effect 4: Particle Field
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 2,
      opacity: Math.random() * 0.25 + 0.15,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  // Effect 2: Staggered Word Reveal
  const headline = "Turn Any Website Into a Mobile App";
  const words = headline.split(" ");
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };
  const wordVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  // Effect 3: Magnetic Button
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.matchMedia('(hover: none)').matches) return;
    if (!buttonRef.current) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Max offset 12px
    const offsetX = (e.clientX - centerX) * 0.3;
    const offsetY = (e.clientY - centerY) * 0.3;
    mouseX.set(Math.max(-12, Math.min(12, offsetX)));
    mouseY.set(Math.max(-12, Math.min(12, offsetY)));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900"
    >
      {/* Effect 1: Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1 top-[10%] left-[20%]" />
        <div className="blob blob-2 top-[40%] right-[15%]" />
        <div className="blob blob-3 bottom-[10%] left-[30%]" />
      </div>

      {/* Effect 4: Particle Field */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
            }}
            animate={{ y: ["0vh", "-100vh"] }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.div 
        style={{ y, opacity, scale }}
        className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] mb-8 text-sm font-medium text-cyan-400"
        >
          <Sparkles className="w-4 h-4" />
          <span>✦ Free Forever — No Account Needed</span>
        </motion.div>

        {/* Effect 2: Headline */}
        <motion.h1 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-5xl mx-auto flex flex-wrap justify-center gap-[0.2em]"
        >
          {words.map((word, i) => (
            <span key={i} className="overflow-hidden inline-block">
              <motion.span variants={wordVariants} className="inline-block">
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Paste a URL. Get an installable app in seconds. No code. No fees.
        </motion.p>

        {/* Effect 3: Magnetic Button */}
        <div 
          className="p-8 -m-8" 
          onMouseMove={handleMouseMove} 
          onMouseLeave={handleMouseLeave}
        >
          <motion.button
            ref={buttonRef}
            onClick={onStartClick}
            style={{ x: smoothX, y: smoothY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, type: "spring", bounce: 0.4 }}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan-400 text-black font-bold rounded-full text-lg overflow-hidden shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] transition-shadow"
          >
            {/* Shimmer sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
            <span className="relative z-10">Start to Create</span>
            <ArrowRight className="w-5 h-5 relative z-10" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
