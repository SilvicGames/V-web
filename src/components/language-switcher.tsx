'use client';

import { useLanguage } from '@/context/language-context';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <Button
      onClick={toggleLanguage}
      className="bg-secondary/80 hover:bg-secondary text-secondary-foreground font-semibold rounded-lg px-4 py-1.5 text-sm border-2 border-black/20 shadow-lg transition-transform hover:scale-105"
    >
      {language === 'es' ? 'English' : 'Español'}
    </Button>
  );
}
