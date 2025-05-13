
import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ 
  text,
  size = 'md',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 'h-3 w-3 sm:h-3.5 sm:w-3.5' : 'h-3.5 w-3.5 sm:h-4 sm:w-4';
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Info className={`${iconSize} text-muted-foreground cursor-help ${className}`} />
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center" 
          className="max-w-[250px] sm:max-w-[350px] text-xs sm:text-sm z-[1000]"
          sideOffset={10}
          avoidCollisions={true}
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
