import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, Type, Palette, Smartphone, Loader2, AlertCircle } from 'lucide-react';
import { validateUrl } from '../lib/validateUrl';
import { generateZip } from '../lib/generateZip';
import { saveConversion } from '../lib/storage';

export function Convert() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlParam = searchParams.get('url');

  useEffect(() => {
    if (!urlParam) {
      navigate('/');
    }
  }, [urlParam, navigate]);

  // Extract hostname for default app name
  const defaultAppName = React.useMemo(() => {
    if (!urlParam) return 'App';
    try {
      const urlObj = new URL(urlParam.startsWith('http') ? urlParam : `https://${urlParam}`);
      let hostname = urlObj.hostname.replace(/^www\./, '');
      hostname = hostname.split('.')[0];
      return hostname.charAt(0).toUpperCase() + hostname.slice(1);
    } catch {
      return 'App';
    }
  }, [urlParam]);

  const [appName, setAppName] = useState(defaultAppName);
  const [themeColor, setThemeColor] = useState('#22d3ee');
  const [iconBase64, setIconBase64] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setIconBase64(event.target?.result as string);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read file.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!urlParam) return;
    setError(null);
    setIsGenerating(true);

    try {
      const fullUrl = urlParam.startsWith('http') ? urlParam : `https://${urlParam}`;
      const { valid, error: validationError } = await validateUrl(fullUrl);
      
      if (!valid) {
        throw new Error(validationError || 'Invalid URL');
      }

      const config = {
        appName,
        themeColor,
        url: fullUrl,
        iconBase64
      };

      const zipBlob = await generateZip(config);
      
      // Trigger download
      const objectUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${appName.toLowerCase().replace(/\s+/g, '-')}-pwa.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);

      // Save to history
      const conversionId = crypto.randomUUID();
      saveConversion({
        id: conversionId,
        url: fullUrl,
        appName,
        themeColor,
        iconBase64,
        createdAt: new Date().toISOString()
      });

      // Navigate to result
      navigate('/result', { 
        state: { appName, url: fullUrl, themeColor, iconBase64 } 
      });

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during generation.');
      setIsGenerating(false);
    }
  };

  if (!urlParam) return null;

  const displayUrl = urlParam.length > 40 ? urlParam.substring(0, 40) + '...' : urlParam;
  const initial = appName ? appName.charAt(0).toUpperCase() : '?';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">Configure Your App</h1>
          <p className="text-slate-400 text-lg font-mono">{displayUrl}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* LEFT: Configuration Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            {/* App Name */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                <Type className="w-4 h-4 text-cyan-400" />
                App Name
              </label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                placeholder="My Awesome App"
              />
            </div>

            {/* Theme Color */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                <Palette className="w-4 h-4 text-cyan-400" />
                Theme Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-14 h-14 rounded-xl cursor-pointer bg-transparent border-0 p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch]:rounded-xl"
                />
                <div className="font-mono text-lg bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                  {themeColor.toUpperCase()}
                </div>
              </div>
            </div>

            {/* App Icon */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-xl">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                <Upload className="w-4 h-4 text-cyan-400" />
                App Icon
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="shrink-0 w-24 h-24 rounded-3xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center shadow-lg">
                  {iconBase64 ? (
                    <img src={iconBase64} alt="App Icon" className="w-full h-full object-cover" />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center text-3xl font-bold"
                      style={{ backgroundColor: themeColor, color: '#fff' }}
                    >
                      {initial}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 w-full">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm font-medium"
                  >
                    Upload Custom Image
                  </button>
                  <p className="text-xs text-slate-500 mt-3 text-center sm:text-left">
                    Recommended: 512x512 PNG or SVG
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Preview Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="sticky top-12">
              <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-4 shadow-2xl relative overflow-hidden aspect-[9/19] max-w-[320px] mx-auto flex flex-col items-center justify-center">
                
                {/* Dynamic Theme Glow */}
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 blur-[80px] rounded-full pointer-events-none opacity-30 transition-colors duration-500"
                  style={{ backgroundColor: themeColor }}
                />

                <div className="relative z-10 flex flex-col items-center gap-6 w-full px-6">
                  <div className="w-28 h-28 rounded-[2rem] overflow-hidden bg-slate-800 shadow-2xl flex items-center justify-center border border-white/5">
                    {iconBase64 ? (
                      <img src={iconBase64} alt="App Icon Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-4xl font-bold transition-colors duration-500"
                        style={{ backgroundColor: themeColor, color: '#fff' }}
                      >
                        {initial}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center w-full">
                    <h3 className="text-2xl font-bold truncate mb-1">{appName || 'App'}</h3>
                    <p className="text-sm text-slate-400 truncate opacity-70 flex items-center justify-center gap-1">
                      <Smartphone className="w-3 h-3" />
                      Standalone PWA
                    </p>
                  </div>
                  
                  {/* Mock Install Button */}
                  <div 
                    className="w-full py-3 rounded-full text-center font-bold mt-4 shadow-lg transition-colors duration-500 text-sm"
                    style={{ backgroundColor: themeColor, color: '#000' }}
                  >
                    Install App
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-400">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !appName.trim()}
                className="w-full mt-8 py-5 bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating ZIP...
                  </>
                ) : (
                  'Generate App'
                )}
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
