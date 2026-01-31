
import React from 'react';
import { TranslationSet, Language } from '../types';

interface SettingsProps {
  t: TranslationSet;
  lang: Language;
  setLang: (l: Language) => void;
  isSoundOn: boolean;
  setIsSoundOn: (s: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ t, lang, setLang, isSoundOn, setIsSoundOn }) => {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <h2 className={`text-4xl font-bold mb-10 arcade-font text-white ${lang === 'ur' ? 'urdu' : ''}`}>
        {t.settings}
      </h2>
      
      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden divide-y divide-slate-700">
        <div className="p-8">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            <span>🌍</span> {t.language}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'en', label: 'English' },
              { id: 'ur', label: 'اردو (Urdu)' },
              { id: 'ru', label: 'Roman Urdu' },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id as Language)}
                className={`py-3 px-4 rounded-xl font-bold transition-all border-2 ${
                  lang === l.id 
                    ? 'bg-blue-600 border-blue-400 text-white' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔊</span>
            <div>
              <h3 className="text-xl font-bold text-white">{t.sound}</h3>
              <p className="text-slate-500 text-sm">Game sound effects & music</p>
            </div>
          </div>
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className={`w-16 h-8 rounded-full transition-colors relative ${isSoundOn ? 'bg-blue-600' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${isSoundOn ? 'left-9' : 'left-1'}`}></div>
          </button>
        </div>
      </div>
      
      <div className="mt-8 text-center text-slate-500 text-sm">
        Platform Version: 1.0.4-beta • Built by Taimoor
      </div>
    </div>
  );
};

export default Settings;
