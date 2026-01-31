
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameProps } from '../types';
import { translations } from '../translations';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

const SnakeGame: React.FC<GameProps> = ({ onBack, lang }) => {
  const t = translations[lang];
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('snake_highscore')) || 0);
  const [isPaused, setIsPaused] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Fix: Added null as an initial argument to useRef to resolve "Expected 1 arguments, but got 0" error.
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: {x:number, y:number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(part => part.x === newFood.x && part.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      // Wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((part, index) => index !== 0 && part.x === head.x && part.y === head.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const interval = INITIAL_SPEED - Math.min(100, Math.floor(score / 50) * 5);
    const loop = setInterval(moveSnake, interval);
    return () => clearInterval(loop);
  }, [moveSnake, score]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake_highscore', score.toString());
    }
  }, [gameOver, score, highScore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid (optional styling)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for(let i=0; i<GRID_SIZE; i++) {
        ctx.beginPath(); ctx.moveTo(i * (canvas.width/GRID_SIZE), 0); ctx.lineTo(i * (canvas.width/GRID_SIZE), canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * (canvas.height/GRID_SIZE)); ctx.lineTo(canvas.width, i * (canvas.height/GRID_SIZE)); ctx.stroke();
    }

    // Snake
    snake.forEach((part, i) => {
      ctx.fillStyle = i === 0 ? '#3b82f6' : '#60a5fa';
      ctx.shadowBlur = i === 0 ? 15 : 0;
      ctx.shadowColor = '#3b82f6';
      ctx.fillRect(
        part.x * (canvas.width / GRID_SIZE) + 1,
        part.y * (canvas.height / GRID_SIZE) + 1,
        (canvas.width / GRID_SIZE) - 2,
        (canvas.height / GRID_SIZE) - 2
      );
    });

    // Food
    ctx.fillStyle = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    const centerX = food.x * (canvas.width / GRID_SIZE) + (canvas.width / GRID_SIZE) / 2;
    const centerY = food.y * (canvas.height / GRID_SIZE) + (canvas.height / GRID_SIZE) / 2;
    ctx.arc(centerX, centerY, (canvas.width / GRID_SIZE) / 3, 0, Math.PI * 2);
    ctx.fill();

  }, [snake, food]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 0, y: -1 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center bg-slate-900 rounded-3xl p-6 border border-slate-700 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2">
           ← {t.back}
        </button>
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest">{t.score}</p>
          <p className="text-2xl font-bold arcade-font text-blue-500">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest">{t.highScore}</p>
          <p className="text-xl font-bold arcade-font text-white">{highScore}</p>
        </div>
      </div>

      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="bg-slate-950 rounded-xl border-4 border-slate-800 shadow-inner max-w-full h-auto cursor-none"
        />
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center rounded-xl backdrop-blur-sm">
            <h3 className="text-3xl font-bold text-white mb-6 arcade-font">PAUSED</h3>
            <button onClick={() => setIsPaused(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold uppercase arcade-font">
              {t.resume}
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center rounded-xl backdrop-blur-md">
            <h3 className="text-4xl font-bold text-white mb-2 arcade-font">{t.gameOver}</h3>
            <p className="text-red-200 mb-8 font-bold">FINAL SCORE: {score}</p>
            <button onClick={resetGame} className="bg-white text-red-900 hover:bg-red-100 px-8 py-3 rounded-xl font-bold uppercase arcade-font">
              {t.restart}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-2 mt-8 md:hidden">
        <div></div>
        <button onClick={() => direction.y === 0 && setDirection({x:0, y:-1})} className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl active:bg-blue-600 active:scale-95 transition-all">↑</button>
        <div></div>
        <button onClick={() => direction.x === 0 && setDirection({x:-1, y:0})} className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl active:bg-blue-600 active:scale-95 transition-all">←</button>
        <button onClick={() => setIsPaused(!isPaused)} className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold active:scale-90">{isPaused ? '▶' : '||'}</button>
        <button onClick={() => direction.x === 0 && setDirection({x:1, y:0})} className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl active:bg-blue-600 active:scale-95 transition-all">→</button>
        <div></div>
        <button onClick={() => direction.y === 0 && setDirection({x:0, y:1})} className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl active:bg-blue-600 active:scale-95 transition-all">↓</button>
        <div></div>
      </div>
      
      {!isPaused && !gameOver && (
        <button onClick={() => setIsPaused(true)} className="mt-6 hidden md:block text-slate-500 hover:text-white uppercase text-sm font-bold tracking-widest">
          Press P or Click to Pause
        </button>
      )}
    </div>
  );
};

export default SnakeGame;
