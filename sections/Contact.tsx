
import React from 'react';
import { TranslationSet, Language } from '../types';

interface ContactProps {
  t: TranslationSet;
  lang: Language;
}

const Contact: React.FC<ContactProps> = ({ t, lang }) => {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className={`text-4xl font-bold mb-6 arcade-font text-white ${lang === 'ur' ? 'urdu' : ''}`}>
            {t.contact}
          </h2>
          <p className="text-slate-400 text-lg mb-10">Have questions or want to collaborate? Feel free to reach out to Taimoor and his team.</p>
          
          <div className="space-y-6">
            {[
              { icon: '📧', label: 'Email', value: 'hello@taimoorgames.com' },
              { icon: '📍', label: 'Location', value: 'Global / Remote' },
              { icon: '🐦', label: 'Twitter', value: '@taimoorgames' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-700">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">{item.label}</p>
                  <p className="text-white font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
              <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
              <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
              <textarea rows={4} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 outline-none resize-none"></textarea>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest arcade-font">
              {t.send}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
