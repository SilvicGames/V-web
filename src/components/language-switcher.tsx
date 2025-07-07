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
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="bg-background/50 hover:bg-background/80 border-border/50 text-foreground"
    >
      {language === 'es' ? 'English' : 'Español'}
    </Button>
  );
}
