
import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '../types';
import { translations } from '../translations';

const ShooterGame: React.FC<GameProps> = ({ onBack, lang }) => {
  const t = translations[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);

  const gameData = useRef({
    player: { x: 200, y: 350, w: 40, h: 40 },
    bullets: [] as any[],
    enemies: [] as any[],
    frames: 0,
    keys: {} as Record<string, boolean>,
  });

  const resetGame = () => {
    gameData.current = {
      player: { x: 180, y: 340, w: 40, h: 40 },
      bullets: [],
      enemies: [],
      frames: 0,
      keys: {},
    };
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const hDown = (e: KeyboardEvent) => (gameData.current.keys[e.key] = true);
    const hUp = (e: KeyboardEvent) => (gameData.current.keys[e.key] = false);
    window.addEventListener('keydown', hDown);
    window.addEventListener('keyup', hUp);
    return () => {
      window.removeEventListener('keydown', hDown);
      window.removeEventListener('keyup', hUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    const loop = () => {
      const d = gameData.current;
      const p = d.player;

      // Player Movement
      if (d.keys['ArrowLeft'] && p.x > 0) p.x -= 5;
      if (d.keys['ArrowRight'] && p.x < canvas.width - p.w) p.x += 5;

      // Shooting
      d.frames++;
      if (d.frames % 15 === 0) {
        d.bullets.push({ x: p.x + p.w / 2 - 2, y: p.y, w: 4, h: 10 });
      }

      // Enemy Spawn
      if (d.frames % 60 === 0) {
        d.enemies.push({ 
          x: Math.random() * (canvas.width - 30), 
          y: -30, 
          w: 30, 
          h: 30, 
          speed: 2 + Math.random() * 2 
        });
      }

      // Update Bullets
      d.bullets.forEach((b, i) => {
        b.y -= 7;
        if (b.y < 0) d.bullets.splice(i, 1);
      });

      // Update Enemies
      d.enemies.forEach((en, i) => {
        en.y += en.speed;
        
        // Collision with Player
        if (
          p.x < en.x + en.w &&
          p.x + p.w > en.x &&
          p.y < en.y + en.h &&
          p.y + p.h > en.y
        ) {
          setGameState('gameOver');
        }

        // Collision with Bullet
        d.bullets.forEach((b, bi) => {
          if (
            b.x < en.x + en.w &&
            b.x + b.w > en.x &&
            b.y < en.y + en.h &&
            b.y + b.h > en.y
          ) {
            d.enemies.splice(i, 1);
            d.bullets.splice(bi, 1);
            setScore(s => s + 10);
          }
        });

        if (en.y > canvas.height) d.enemies.splice(i, 1);
      });

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Starfield (simple)
      ctx.fillStyle = '#fff';
      for(let i=0; i<10; i++) ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 1, 1);

      // Ship
      ctx.fillStyle = '#3b82f6';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(p.x + p.w / 2, p.y);
      ctx.lineTo(p.x, p.y + p.h);
      ctx.lineTo(p.x + p.w, p.y + p.h);
      ctx.closePath();
      ctx.fill();

      // Bullets
      ctx.fillStyle = '#60a5fa';
      d.bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

      // Enemies
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      d.enemies.forEach(en => ctx.fillRect(en.x, en.y, en.w, en.h));
      ctx.shadowBlur = 0;

      if (gameState === 'playing') animId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center bg-slate-900 rounded-3xl p-6 border border-slate-700 max-w-2xl mx-auto shadow-2xl relative">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2">← {t.back}</button>
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest">{t.score}</p>
          <p className="text-2xl font-bold arcade-font text-blue-500">{score}</p>
        </div>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} width={400} height={400} className="bg-black rounded-xl border-4 border-slate-800 shadow-inner" />
        
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center rounded-xl backdrop-blur-md">
            <h3 className="text-3xl font-bold text-white mb-6 arcade-font">GALAXY GUARD</h3>
            <button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold arcade-font">
              {t.start}
            </button>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center rounded-xl backdrop-blur-md">
            <h3 className="text-4xl font-bold text-white mb-2 arcade-font">{t.gameOver}</h3>
            <button onClick={resetGame} className="bg-white text-red-900 hover:bg-red-50 px-8 py-3 rounded-xl font-bold arcade-font">
              {t.restart}
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <button onTouchStart={() => (gameData.current.keys['ArrowLeft'] = true)} onTouchEnd={() => (gameData.current.keys['ArrowLeft'] = false)} className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl">←</button>
        <button onTouchStart={() => (gameData.current.keys['ArrowRight'] = true)} onTouchEnd={() => (gameData.current.keys['ArrowRight'] = false)} className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center text-4xl">→</button>
      </div>
    </div>
  );
};

export default ShooterGame;
