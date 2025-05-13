
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <TooltipProvider>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className={`text-sm font-medium flex items-center gap-1.5 ${language === 'ar' ? 'flex-row-reverse' : ''}`}
        title={language === 'en' ? 'العربية' : 'English'}
        aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      >
        <Globe className="h-4 w-4" />
        <span>{language === 'en' ? 'العربية' : 'English'}</span>
      </Button>
    </TooltipProvider>
  );
}
