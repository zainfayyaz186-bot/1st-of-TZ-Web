
import React from 'react';
import { TranslationSet, Language } from '../types';

interface AboutProps {
  t: TranslationSet;
  lang: Language;
}

const About: React.FC<AboutProps> = ({ t, lang }) => {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="bg-slate-800 p-8 md:p-12 rounded-3xl border border-slate-700 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-48 h-48 shrink-0 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-6xl shadow-2xl">
            👤
          </div>
          
          <div>
            <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-2 block">{t.ownerRole}</span>
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 arcade-font text-white ${lang === 'ur' ? 'urdu' : ''}`}>
              {t.ownerName}
            </h2>
            <div className="h-1 w-20 bg-blue-600 mb-8 rounded-full"></div>
            <p className={`text-xl text-slate-300 leading-relaxed ${lang === 'ur' ? 'urdu text-2xl text-right' : ''}`}>
              {t.aboutText}
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
          <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
          <p className="text-slate-400">To democratize gaming by removing hardware and cost barriers. Everyone deserves high-quality entertainment at their fingertips.</p>
        </div>
        <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700">
          <h3 className="text-2xl font-bold mb-4 text-white">Platform Growth</h3>
          <p className="text-slate-400">We are constantly adding new games and features. Taimoor Games is built with the latest web technologies for maximum performance.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
