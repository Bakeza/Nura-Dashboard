
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface AnalysisErrorProps {
  errorMessage: string;
}

export const AnalysisError: React.FC<AnalysisErrorProps> = ({ errorMessage }) => {
  return (
    <Card className="glass md:col-span-2">
      <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-2" />
        <h3 className="text-lg font-medium mb-1">Error Loading Analysis Data</h3>
        <p className="text-muted-foreground text-center">
          {errorMessage}
        </p>
      </CardContent>
    </Card>
  );
};
