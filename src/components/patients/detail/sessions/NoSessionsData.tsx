
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoSessionsDataProps {
  onCreateSession?: () => void;
}

export const NoSessionsData: React.FC<NoSessionsDataProps> = ({ onCreateSession }) => {
  return (
    <div className="p-8 text-center h-64 flex flex-col justify-center items-center">
      <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
      <h3 className="font-medium text-lg mb-2">No Session Data Available</h3>
      <p className="text-muted-foreground max-w-md">
        Sessions will appear here after the patient completes cognitive assessments.
      </p>
      <p className="text-xs text-muted-foreground mt-2 mb-4">
        You can view detailed performance metrics across different cognitive domains once sessions are recorded.
      </p>
      
      {onCreateSession && (
        <Button 
          size="sm" 
          onClick={onCreateSession}
        >
          Schedule Assessment
        </Button>
      )}
    </div>
  );
};
