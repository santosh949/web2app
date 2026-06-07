import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Download, History, LayoutDashboard, Home } from 'lucide-react';
import { getConversions, deleteConversion, clearConversions } from '../lib/storage';
import type { Conversion } from '../types/conversion';
import { generateZip } from '../lib/generateZip';

export function Dashboard() {
  const navigate = useNavigate();
  const [conversions, setConversions] = useState<Conversion[]>([]);

  useEffect(() => {
    setConversions(getConversions());
  }, []);

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire conversion history?")) {
      clearConversions();
      setConversions([]);
    }
  };

  const handleDelete = (id: string) => {
    deleteConversion(id);
    setConversions(prev => prev.filter(c => c.id !== id));
  };

  const handleDownload = async (config: Conversion) => {
    try {
      const zipBlob = await generateZip({
        appName: config.appName,
        url: config.url,
        themeColor: config.themeColor,
        iconBase64: config.iconBase64
      });
      const objectUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${config.appName.toLowerCase().replace(/\s+/g, '-')}-pwa.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Failed to generate ZIP", err);
      alert("Failed to generate ZIP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 transition-colors"
            >
              <Home className="w-5 h-5 text-slate-300" />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-cyan-400" />
              My Conversions
            </h1>
          </div>

          {conversions.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-6 py-2.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold"
            >
              Clear All
            </button>
          )}
        </div>

        {conversions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center shadow-xl flex flex-col items-center justify-center min-h-[50vh]"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <History className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-2xl font-bold mb-3">No conversions yet</h2>
            <p className="text-slate-400 mb-8 max-w-sm">
              You haven't converted any websites into apps yet. Your history will appear here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-bold rounded-2xl shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all"
            >
              Convert a Site
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversions.map((conversion, index) => {
              const date = new Date(conversion.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric'
              });
              
              return (
                <motion.div
                  key={conversion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-lg flex flex-col group hover:bg-white/10 transition-colors relative overflow-hidden"
                >
                  <div 
                    className="absolute top-0 right-0 w-24 h-24 blur-[40px] opacity-20 pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"
                    style={{ backgroundColor: conversion.themeColor }}
                  />

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-lg overflow-hidden shrink-0 border border-white/10"
                        style={{ backgroundColor: conversion.themeColor }}
                      >
                        {conversion.iconBase64 ? (
                          <img src={conversion.iconBase64} alt="icon" className="w-full h-full object-cover" />
                        ) : (
                          conversion.appName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-lg truncate pr-4">{conversion.appName}</h3>
                        <p className="text-xs text-slate-400 truncate pr-4">{date}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-mono text-slate-400 bg-black/40 px-3 py-2 rounded-lg mb-6 truncate border border-white/5">
                    {conversion.url}
                  </p>

                  <div className="mt-auto flex items-center gap-3">
                    <button
                      onClick={() => handleDownload(conversion)}
                      className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download Again
                    </button>
                    <button
                      onClick={() => handleDelete(conversion.id)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-colors shrink-0"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
