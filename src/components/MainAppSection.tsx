import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link2, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { validateUrl } from '../lib/validateUrl';

const placeholders = ["https://stripe.com", "https://notion.so", "https://linear.app"];

export const MainAppSection = React.forwardRef<HTMLDivElement>((_props, ref) => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Effect 6: Typewriter Placeholder
  const [placeholderText, setPlaceholderText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isFocused || url) {
      setPlaceholderText('');
      return;
    }

    const currentUrl = placeholders[placeholderIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (placeholderText.length < currentUrl.length) {
        timeout = setTimeout(() => {
          setPlaceholderText(currentUrl.slice(0, placeholderText.length + 1));
        }, 80);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (placeholderText.length > 0) {
        timeout = setTimeout(() => {
          setPlaceholderText(placeholderText.slice(0, -1));
        }, 40);
      } else {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, placeholderIndex, isFocused, url]);

  // Effect 7: Ripple + Pulse
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);
  const nextRippleId = useRef(0);

  const handleRippleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = nextRippleId.current++;
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsLoading(true);
    setError(null);

    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    const { valid, error: validationError } = await validateUrl(fullUrl);
    
    if (!valid) {
      setError(validationError || 'Invalid URL');
      setIsLoading(false);
      return;
    }

    navigate(`/convert?url=${encodeURIComponent(fullUrl)}`);
  };

  return (
    <div id="convert" ref={ref} className="relative min-h-[80vh] flex flex-col items-center justify-center py-20 bg-[#0f172a]">
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        
        <div className="text-cyan-400 text-sm tracking-widest uppercase mb-8 font-semibold">
          — Convert Now —
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl relative"
        >
          {/* Effect 5: Glassmorphism Card with Glow */}
          <div className={`relative overflow-hidden rounded-3xl p-8 md:p-16 transition-all duration-300 bg-white/5 backdrop-blur-xl border ${isFocused ? 'border-cyan-400/50 shadow-[0_0_0_1px_rgba(34,211,238,0.3),_0_0_30px_rgba(34,211,238,0.1)]' : 'border-white/10'}`}>
            
            <div className="relative z-10 text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to build?</h2>
              <p className="text-slate-400 text-lg">Enter your website URL below to begin the magic.</p>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 max-w-2xl mx-auto">
              <div className="relative flex items-center group">
                <div className={`absolute left-6 transition-colors duration-300 ${isFocused ? 'text-cyan-400' : 'text-slate-400'}`}>
                  <Link2 className="w-6 h-6" />
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isFocused ? "https://..." : placeholderText}
                  className="w-full pl-16 pr-44 py-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 focus:border-cyan-400/0 focus:outline-none transition-all duration-300 text-lg text-white placeholder-slate-500"
                  required
                />
                
                <div className="absolute right-3">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    onClick={handleRippleClick}
                    animate={!isLoading && !isFocused && !url ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                    transition={!isLoading && !isFocused && !url ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                    className="relative px-6 py-3 bg-white text-black font-semibold rounded-xl flex items-center gap-2 hover:bg-cyan-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden group/btn"
                  >
                    {/* Ripple Effect Container */}
                    {ripples.map(ripple => (
                      <motion.span
                        key={ripple.id}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute rounded-full bg-cyan-400/30 pointer-events-none"
                        style={{
                          left: ripple.x,
                          top: ripple.y,
                          width: 100,
                          height: 100,
                          transform: 'translate(-50%, -50%)'
                        }}
                      />
                    ))}
                    
                    <span className="relative z-10 flex items-center gap-2">
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Convert
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </div>
              </div>
              {error && (
                <div className="absolute -bottom-8 left-0 right-0 text-center text-red-400 text-sm font-medium flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

MainAppSection.displayName = 'MainAppSection';
