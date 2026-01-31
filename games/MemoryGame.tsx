
import React, { useState, useEffect } from 'react';
import { GameProps } from '../types';
import { translations } from '../translations';

const SYMBOLS = ['🎮', '🚀', '🔥', '💎', '⚡', '🌈', '🧩', '🛸'];

const MemoryGame: React.FC<GameProps> = ({ onBack, lang }) => {
  const t = translations[lang];
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initGame = () => {
    const deck = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));
    setCards(deck);
    setFlipped([]);
    setSolved([]);
    setMoves(0);
    setGameOver(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].symbol === cards[second].symbol) {
        setSolved(prev => [...prev, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
      setMoves(m => m + 1);
    }
  }, [flipped, cards]);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setGameOver(true);
    }
  }, [solved, cards]);

  const handleCardClick = (index: number) => {
    if (flipped.length < 2 && !flipped.includes(index) && !solved.includes(index)) {
      setFlipped(prev => [...prev, index]);
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-900 rounded-3xl p-6 border border-slate-700 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="w-full flex justify-between items-center mb-10">
        <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2">← {t.back}</button>
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Moves</p>
          <p className="text-2xl font-bold arcade-font text-blue-500">{moves}</p>
        </div>
        <button onClick={initGame} className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold border border-slate-700 hover:bg-slate-700">{t.restart}</button>
      </div>

      <div className="grid grid-cols-4 gap-4 w-full max-w-md">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || solved.includes(idx);
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`aspect-square rounded-2xl cursor-pointer transition-all duration-300 transform preserve-3d flex items-center justify-center text-4xl shadow-lg border-2 ${
                isFlipped 
                  ? 'bg-blue-600 border-blue-400 scale-95 rotate-y-180' 
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isFlipped ? card.symbol : '?'}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center backdrop-blur-md z-10">
          <h2 className="text-4xl font-bold text-white mb-2 arcade-font">WELL DONE!</h2>
          <p className="text-blue-400 mb-8 font-bold">FINISHED IN {moves} MOVES</p>
          <button onClick={initGame} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold arcade-font shadow-lg shadow-blue-500/30">
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
