import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Smartphone, Zap } from 'lucide-react';

const steps = [
  {
    icon: Code2,
    title: "Paste Your URL",
    description: "Simply enter your existing website URL. We support React, Vue, HTML, Next.js and more.",
  },
  {
    icon: Zap,
    title: "Configure Your App",
    description: "Our engine maps your web components to native UI elements for iOS and Android.",
  },
  {
    icon: Smartphone,
    title: "Download & Install",
    description: "Get compiled binaries and push them directly to the App Store and Google Play.",
  }
];

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Effect 11: Odometer state
  const [stepNumbers, setStepNumbers] = useState([0, 0, 0]);

  useEffect(() => {
    if (isInView) {
      const timers = [
        setTimeout(() => setStepNumbers(prev => [1, prev[1], prev[2]]), 200),
        setTimeout(() => setStepNumbers(prev => [prev[0], 2, prev[2]]), 350),
        setTimeout(() => setStepNumbers(prev => [prev[0], prev[1], 3]), 500),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isInView]);

  // Effect 9: Torch Effect handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.background = `radial-gradient(300px at ${x}px ${y}px, rgba(34,211,238,0.07), rgba(255,255,255,0.03))`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
  };

  return (
    <div className="relative py-24 bg-slate-900 overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">How it works</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A seamless bridge from web to mobile. Experience the magic of instant conversion without touching a single line of code.
          </p>
        </motion.div>

        <div className="relative">
          {/* Effect 10: Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[80px] left-[16%] right-[16%] h-px z-0">
            <svg width="100%" height="20" className="overflow-visible">
              <motion.path
                d="M 0 0 C 100 0, 150 0, 100% 0"
                fill="none"
                stroke="rgba(34,211,238,0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
              {isInView && (
                <motion.circle
                  r="3"
                  fill="#22d3ee"
                  initial={{ offsetDistance: "0%" } as any}
                  animate={{ offsetDistance: "100%" } as any}
                  transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, delay: 2 }}
                  style={{ offsetPath: "path('M 0 0 C 100 0, 150 0, 100% 0')" } as any}
                />
              )}
            </svg>
          </div>

          {/* Effect 8: Staggered Cards */}
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.15, type: "spring", bounce: 0.3 }}
                className="relative rounded-3xl overflow-hidden border border-white/5"
              >
                {/* Effect 9: Torch card body */}
                <div 
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className="h-full rounded-3xl p-8 pt-12 flex flex-col items-start backdrop-blur-xl transition-colors duration-300"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <step.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  
                  {/* Effect 11: Odometer */}
                  <div className="text-cyan-500 font-mono text-sm tracking-widest uppercase mb-4 flex items-center odometer-digit">
                    Step 0
                    <motion.span
                      initial={{ rotateX: -90, opacity: 0 }}
                      animate={stepNumbers[index] > 0 ? { rotateX: 0, opacity: 1 } : { rotateX: -90, opacity: 0 }}
                      transition={{ duration: 0.4, type: "spring" }}
                      className="inline-block"
                    >
                      {stepNumbers[index]}
                    </motion.span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
