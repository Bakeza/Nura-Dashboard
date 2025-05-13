
import React from 'react';
import { InfoIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

export interface MetricTooltipProps {
  explanation: string;
  children?: React.ReactNode;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({ explanation, children }) => {
  const { language } = useLanguage();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children ? (
            <span className="cursor-help inline-flex items-center">
              {children}
              <InfoIcon className={`inline-block h-4 w-4 opacity-70 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
            </span>
          ) : (
            <InfoIcon className={`inline-block h-4 w-4 cursor-help opacity-70 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className={language === 'ar' ? 'text-right' : 'text-left'}>{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
