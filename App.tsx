
import React, { useState, useEffect } from 'react';
import { Language, Game } from './types';
import { translations } from './translations';
import Navbar from './components/Navbar';
import Home from './sections/Home';
import GamesSection from './sections/GamesSection';
import AIAssistant from './sections/AIAssistant';
import About from './sections/About';
import Contact from './sections/Contact';
import Settings from './sections/Settings';
import SnakeGame from './games/SnakeGame';
import RunnerGame from './games/RunnerGame';
import MemoryGame from './games/MemoryGame';
import ShooterGame from './games/ShooterGame';
import ReflexGame from './games/ReflexGame';

const GAMES: Game[] = [
  { id: 'snake', title: 'Cyber Snake', description: 'Classic arcade snake with a neon twist. Grow long and stay alive!', thumbnail: 'https://picsum.photos/seed/snake/400/300', category: 'Arcade', component: SnakeGame },
  { id: 'runner', title: 'Velocity Run', description: 'Jump over obstacles and run as far as you can in this endless runner.', thumbnail: 'https://picsum.photos/seed/runner/400/300', category: 'Runner', component: RunnerGame },
  { id: 'memory', title: 'Brain Match', description: 'Test your memory by matching pairs of cards in record time.', thumbnail: 'https://picsum.photos/seed/memory/400/300', category: 'Puzzle', component: MemoryGame },
  { id: 'shooter', title: 'Galaxy Guard', description: 'Protect your ship from incoming space invaders.', thumbnail: 'https://picsum.photos/seed/shooter/400/300', category: 'Shooting', component: ShooterGame },
  { id: 'reflex', title: 'Neon Reflex', description: 'Tap the glowing targets before they vanish. Fast fingers win!', thumbnail: 'https://picsum.photos/seed/reflex/400/300', category: 'Reflex', component: ReflexGame },
];

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [lang, setLang] = useState<Language>('en');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const t = translations[lang];

  useEffect(() => {
    // Scroll to top on section change
    window.scrollTo(0, 0);
  }, [currentSection, activeGameId]);

  const renderSection = () => {
    if (activeGameId) {
      const game = GAMES.find(g => g.id === activeGameId);
      if (game) {
        const GameComponent = game.component;
        return <GameComponent onBack={() => setActiveGameId(null)} lang={lang} />;
      }
    }

    switch (currentSection) {
      case 'home': return <Home t={t} lang={lang} onPlay={() => setCurrentSection('games')} />;
      case 'games': return <GamesSection t={t} lang={lang} games={GAMES} onSelectGame={setActiveGameId} />;
      case 'ai': return <AIAssistant t={t} lang={lang} games={GAMES} />;
      case 'about': return <About t={t} lang={lang} />;
      case 'contact': return <Contact t={t} lang={lang} />;
      case 'settings': return <Settings t={t} lang={lang} setLang={setLang} isSoundOn={isSoundOn} setIsSoundOn={setIsSoundOn} />;
      default: return <Home t={t} lang={lang} onPlay={() => setCurrentSection('games')} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${lang === 'ur' ? 'rtl' : 'ltr'}`} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      <Navbar 
        currentSection={currentSection} 
        setCurrentSection={(s) => { setCurrentSection(s); setActiveGameId(null); }} 
        t={t} 
        lang={lang} 
      />
      
      <main className="flex-grow pt-16 container mx-auto px-4 pb-12">
        {renderSection()}
      </main>

      <footer className="bg-slate-900 py-8 border-t border-slate-800 text-center">
        <p className="text-slate-400">© 2024 Taimoor Games. {t.ownerRole} - {t.ownerName}</p>
      </footer>
    </div>
  );
};

export default App;
