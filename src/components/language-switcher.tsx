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
      className="bg-background hover:bg-secondary text-foreground font-semibold rounded-lg px-4 py-2 text-sm border-4 border-gray-800/50 shadow-lg"
    >
      {language === 'es' ? 'English' : 'Español'}
    </Button>
  );
}
