
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getDomainName } from '@/utils/dataProcessing';
import { CognitiveDomain } from '@/utils/types/patientTypes';
import { Gamepad } from 'lucide-react';

interface GameCardProps {
  game: {
    id: number;
    name: string;
    description: string;
    image: string;
    domain: keyof CognitiveDomain;
  };
  onClick: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  game,
  onClick
}) => {
  // Get domain color based on the game's cognitive domain
  const getDomainColorClass = (domain: keyof CognitiveDomain): string => {
    switch(domain) {
      case 'attention':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'memory':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'executiveFunction':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'behavioral':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card 
      className="glass cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]"
      onClick={onClick}
    >
      <div className="h-[120px] overflow-hidden">
        {game.image ? (
          <img 
            src={game.image} 
            alt={game.name} 
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Gamepad className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardContent className="p-3 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-sm sm:text-base">{game.name}</h3>
          <Badge className={`text-xs ${getDomainColorClass(game.domain)}`}>
            {getDomainName(game.domain)}
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
          {game.description}
        </p>
      </CardContent>
    </Card>
  );
};
