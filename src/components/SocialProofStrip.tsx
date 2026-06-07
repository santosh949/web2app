import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const badges = [
  "PWA Ready", "Android APK", "Zero Code", "Instant Preview", 
  "Push Notifications", "Offline Mode", "App Store Approved", "Play Store Ready"
];

export function SocialProofStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-50px" });

  // Effect 12: Counters
  const [appsCount, setAppsCount] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Apps Count (0 to 10000 over 2s)
    let startTimestamp: number;
    const duration = 2000;
    const targetApps = 10000;
    const targetRating = 4.9;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOut cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      setAppsCount(Math.floor(easeProgress * targetApps));
      setRatingCount(Number((easeProgress * targetRating).toFixed(1)));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setAppsCount(targetApps);
        setRatingCount(targetRating);
      }
    };

    window.requestAnimationFrame(step);
  }, [isInView]);

  return (
    <div ref={containerRef} className="w-full py-16 bg-slate-900 border-t border-b border-white/5 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="px-4 py-6 md:py-0"
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              {appsCount.toLocaleString()}+
            </div>
            <div className="text-slate-400 font-medium">Apps Created</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="px-4 py-6 md:py-0"
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              {ratingCount.toFixed(1)}<span className="text-cyan-400">★</span>
            </div>
            <div className="text-slate-400 font-medium">Average Rating</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="px-4 py-6 md:py-0"
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
              &lt; 30s
            </div>
            <div className="text-slate-400 font-medium">Conversion Time</div>
          </motion.div>
        </div>
      </div>

      {/* Effect 13: Horizontal Ticker */}
      <div className="relative w-full overflow-hidden flex bg-white/5 py-4 backdrop-blur-sm border-y border-white/5">
        <div className="animate-scroll flex whitespace-nowrap group hover:[animation-play-state:paused]">
          {[...badges, ...badges, ...badges].map((badge, i) => (
            <span key={i} className="mx-8 text-sm font-semibold tracking-wider uppercase text-cyan-500/80">
              • {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
