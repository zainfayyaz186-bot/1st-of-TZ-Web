
import React from 'react';
import { TranslationSet, Language } from '../types';

interface HomeProps {
  t: TranslationSet;
  lang: Language;
  onPlay: () => void;
}

const Home: React.FC<HomeProps> = ({ t, lang, onPlay }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="relative">
        <div className="absolute -inset-4 bg-blue-600 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 arcade-font text-white relative ${lang === 'ur' ? 'urdu leading-relaxed' : ''}`}>
          {t.welcome}
        </h1>
      </div>
      <p className="text-xl text-slate-400 max-w-2xl mb-12">
        Experience high-performance, lag-free gaming directly in your browser. 
        No downloads. No waiting. Just play.
      </p>
      <button
        onClick={onPlay}
        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 overflow-hidden"
      >
        <span className="relative arcade-font uppercase tracking-widest">{t.playNow}</span>
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl">
        {[
          { icon: '🚀', title: 'Fast Loading', desc: 'Optimized for instant play on any device.' },
          { icon: '🎮', title: 'Free Games', desc: 'Full premium games without hidden costs.' },
          { icon: '🌍', title: 'Multilingual', desc: 'Play in English, Urdu or Roman Urdu.' },
        ].map((feat, idx) => (
          <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
            <div className="text-4xl mb-4">{feat.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white">{feat.title}</h3>
            <p className="text-slate-400">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
