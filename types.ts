
export type Language = 'en' | 'ur' | 'ru';

export interface Game {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  component: React.ComponentType<GameProps>;
}

export interface GameProps {
  onBack: () => void;
  lang: Language;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface TranslationSet {
  home: string;
  games: string;
  ai: string;
  language: string;
  about: string;
  contact: string;
  settings: string;
  playNow: string;
  gameOver: string;
  score: string;
  highScore: string;
  start: string;
  restart: string;
  pause: string;
  resume: string;
  back: string;
  sound: string;
  ownerName: string;
  ownerRole: string;
  aboutText: string;
  send: string;
  aiPlaceholder: string;
  welcome: string;
}
