
import React from 'react';
import { Game, TranslationSet, Language } from '../types';

interface GamesSectionProps {
  t: TranslationSet;
  lang: Language;
  games: Game[];
  onSelectGame: (id: string) => void;
}

const GamesSection: React.FC<GamesSectionProps> = ({ t, lang, games, onSelectGame }) => {
  return (
    <div className="py-8">
      <h2 className={`text-4xl font-bold mb-10 arcade-font text-white ${lang === 'ur' ? 'urdu' : ''}`}>
        {t.games}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="group bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-300 flex flex-col h-full"
          >
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={game.thumbnail} 
                alt={game.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                {game.category}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2 text-white">{game.title}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow">{game.description}</p>
              <button 
                onClick={() => onSelectGame(game.id)}
                className="w-full bg-slate-700 hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                {t.playNow}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesSection;
