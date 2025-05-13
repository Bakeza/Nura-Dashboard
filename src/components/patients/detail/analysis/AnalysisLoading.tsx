
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const AnalysisLoading: React.FC = () => {
  return (
    <Card className="glass md:col-span-2">
      <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
        <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1">Loading Domain Data</h3>
        <p className="text-muted-foreground text-center">
          Please wait while we fetch detailed domain analysis...
        </p>
      </CardContent>
    </Card>
  );
};

