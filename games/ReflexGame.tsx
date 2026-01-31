
import React, { useState, useEffect } from 'react';
import { GameProps } from '../types';
import { translations } from '../translations';

const ReflexGame: React.FC<GameProps> = ({ onBack, lang }) => {
  const t = translations[lang];
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('reflex_highscore')) || 0);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('reflex_highscore', score.toString());
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, highScore]);

  const moveTarget = () => {
    if (!isActive) return;
    setScore(s => s + 1);
    setTarget({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    });
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsActive(true);
    setTarget({ x: 50, y: 50 });
  };

  return (
    <div className="flex flex-col items-center bg-slate-900 rounded-3xl p-6 border border-slate-700 max-w-2xl mx-auto shadow-2xl relative min-h-[500px]">
      <div className="w-full flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2">← {t.back}</button>
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest">Time</p>
            <p className={`text-2xl font-bold arcade-font ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{timeLeft}s</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest">{t.score}</p>
            <p className="text-2xl font-bold arcade-font text-blue-500">{score}</p>
          </div>
        </div>
      </div>

      <div className="flex-grow w-full bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-inner relative overflow-hidden">
        {isActive ? (
          <button
            onClick={moveTarget}
            className="absolute w-16 h-16 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)] border-4 border-blue-300 transition-all duration-100 transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 active:scale-90"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            {timeLeft === 0 ? (
              <>
                <h3 className="text-4xl font-bold text-white mb-2 arcade-font">{t.gameOver}</h3>
                <p className="text-blue-400 text-xl font-bold mb-8">FINAL SCORE: {score}</p>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-white mb-6 arcade-font">NEON REFLEX</h3>
                <p className="text-slate-400 mb-8 max-w-sm">Tap the blue targets as fast as you can before the time runs out!</p>
              </>
            )}
            <button onClick={startGame} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold arcade-font shadow-lg shadow-blue-500/30">
              {timeLeft === 0 ? t.restart : t.start}
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">{t.highScore}</p>
        <p className="text-xl font-bold text-white arcade-font">{highScore}</p>
      </div>
    </div>
  );
};

export default ReflexGame;
