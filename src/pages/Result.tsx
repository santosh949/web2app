import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, ExternalLink, RefreshCw, LayoutDashboard } from 'lucide-react';
import { generateZip } from '../lib/generateZip';

export function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Read state from previous page
  const state = location.state as {
    appName: string;
    url: string;
    themeColor: string;
    iconBase64: string | null;
  };

  // Redirect if accessed directly without state
  if (!state || !state.appName) {
    navigate('/');
    return null;
  }

  const { appName, url, themeColor, iconBase64 } = state;

  const handleDownloadAgain = async () => {
    try {
      const zipBlob = await generateZip({ appName, url, themeColor, iconBase64 });
      const objectUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${appName.toLowerCase().replace(/\s+/g, '-')}-pwa.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Failed to generate ZIP", err);
      alert("Failed to generate ZIP. Please try again.");
    }
  };

  const handlePwaBuilder = () => {
    window.open(`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow based on theme color */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] opacity-10 rounded-full pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 max-w-xl w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
          className="w-24 h-24 mx-auto bg-cyan-400/10 rounded-full flex items-center justify-center mb-8 border border-cyan-400/30"
        >
          <CheckCircle className="w-12 h-12 text-cyan-400" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{appName}</h1>
        <p className="text-slate-400 text-lg mb-10 font-mono truncate px-4">{url}</p>

        <div className="flex flex-col gap-4 mb-10">
          <button
            onClick={handleDownloadAgain}
            className="w-full py-4 bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-colors text-lg"
          >
            <Download className="w-5 h-5" />
            Download ZIP Again
          </button>
          
          <button
            onClick={handlePwaBuilder}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] text-black text-lg"
            style={{ backgroundColor: themeColor }}
          >
            Generate APK (Free)
            <ExternalLink className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 border-t border-white/10 pt-8 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Convert Another
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            View Dashboard
          </button>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
          Note: APK generation uses PWABuilder (a WebView wrapper). Publishing native apps to the Google Play Store requires a Google Developer account ($25 one-time fee).
        </p>
      </motion.div>
    </div>
  );
}
