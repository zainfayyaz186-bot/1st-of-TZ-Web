
import React, { useState, useEffect, useRef } from 'react';
import { GameProps } from '../types';
import { translations } from '../translations';

const VelocityRun: React.FC<GameProps> = ({ onBack, lang }) => {
  const t = translations[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('runner_highscore')) || 0);

  // Game Logic State
  const gameData = useRef({
    player: { x: 50, y: 150, w: 40, h: 40, dy: 0, jump: -12, gravity: 0.6, isJumping: false },
    obstacles: [] as any[],
    speed: 5,
    frames: 0,
    nextObstacle: 100,
  });

  const resetGame = () => {
    gameData.current = {
      player: { x: 50, y: 150, w: 40, h: 40, dy: 0, jump: -12, gravity: 0.6, isJumping: false },
      obstacles: [],
      speed: 5,
      frames: 0,
      nextObstacle: 100,
    };
    setScore(0);
    setGameState('playing');
  };

  const handleJump = () => {
    if (gameState !== 'playing') return;
    const p = gameData.current.player;
    if (!p.isJumping) {
      p.dy = p.jump;
      p.isJumping = true;
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') handleJump();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const loop = () => {
      const data = gameData.current;
      const p = data.player;

      // Update Player
      p.dy += p.gravity;
      p.y += p.dy;

      if (p.y > canvas.height - 40 - p.h) {
        p.y = canvas.height - 40 - p.h;
        p.dy = 0;
        p.isJumping = false;
      }

      // Spawn Obstacles
      data.frames++;
      if (data.frames >= data.nextObstacle) {
        data.obstacles.push({
          x: canvas.width,
          y: canvas.height - 40 - (Math.random() * 40 + 20),
          w: 20,
          h: 40,
        });
        data.frames = 0;
        data.nextObstacle = Math.max(40, 100 - Math.floor(data.speed * 2));
      }

      // Update Obstacles
      data.obstacles.forEach((obs, i) => {
        obs.x -= data.speed;
        
        // Collision
        if (
          p.x < obs.x + obs.w &&
          p.x + p.w > obs.x &&
          p.y < obs.y + obs.h &&
          p.y + p.h > obs.y
        ) {
          setGameState('gameOver');
        }

        // Cleanup and score
        if (obs.x + obs.w < 0) {
          data.obstacles.splice(i, 1);
          setScore(s => s + 1);
          data.speed += 0.05;
        }
      });

      // Render
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Ground
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, canvas.height - 40, canvas.width, 40);

      // Player (Neon Cube)
      ctx.fillStyle = '#3b82f6';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#3b82f6';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.shadowBlur = 0;

      // Obstacles (Red Neon)
      ctx.fillStyle = '#ef4444';
      data.obstacles.forEach(obs => {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ef4444';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      });
      ctx.shadowBlur = 0;

      if (gameState === 'playing') {
        animId = requestAnimationFrame(loop);
      }
    };

    loop();
    return () => cancelAnimationFrame(animId);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'gameOver' && score > highScore) {
      setHighScore(score);
      localStorage.setItem('runner_highscore', score.toString());
    }
  }, [gameState, score]);

  return (
    <div className="flex flex-col items-center bg-slate-900 rounded-3xl p-6 border border-slate-700 max-w-2xl mx-auto shadow-2xl relative overflow-hidden" onMouseDown={handleJump} onTouchStart={handleJump}>
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2">← {t.back}</button>
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest">{t.score}</p>
          <p className="text-2xl font-bold arcade-font text-blue-500">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest">{t.highScore}</p>
          <p className="text-xl font-bold arcade-font text-white">{highScore}</p>
        </div>
      </div>

      <div className="relative w-full max-w-[600px]">
        <canvas ref={canvasRef} width={600} height={300} className="bg-slate-950 rounded-xl border-4 border-slate-800 w-full h-auto shadow-inner" />
        
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/90 flex flex-col items-center justify-center rounded-xl backdrop-blur-md">
            <h3 className="text-3xl font-bold text-white mb-6 arcade-font">VELOCITY RUN</h3>
            <p className="text-slate-400 mb-8 uppercase tracking-widest text-sm">Jump to Survive</p>
            <button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold arcade-font transition-transform hover:scale-105">
              {t.start}
            </button>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center rounded-xl backdrop-blur-md">
            <h3 className="text-4xl font-bold text-white mb-2 arcade-font">{t.gameOver}</h3>
            <p className="text-red-100 mb-8 font-bold">SCORE: {score}</p>
            <button onClick={resetGame} className="bg-white text-red-900 hover:bg-red-50 px-8 py-3 rounded-xl font-bold arcade-font">
              {t.restart}
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-slate-500 text-sm uppercase tracking-widest">
        Tap or Press Space to Jump
      </div>
    </div>
  );
};

export default VelocityRun;
