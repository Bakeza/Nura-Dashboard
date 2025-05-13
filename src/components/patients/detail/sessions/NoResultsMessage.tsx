
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoResultsMessageProps {
  onClearFilters: () => void;
}

export const NoResultsMessage: React.FC<NoResultsMessageProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center p-8 border rounded-md bg-muted/20">
      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
      <h3 className="font-medium text-lg">No matching sessions</h3>
      <p className="text-muted-foreground mb-4">Try adjusting your filters or search query.</p>
      <div className="flex justify-center space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
      </div>
    </div>
  );
};
