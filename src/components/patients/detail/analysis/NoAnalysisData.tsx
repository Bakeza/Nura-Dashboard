
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartBar } from 'lucide-react';

export const NoAnalysisData: React.FC = () => {
  return (
    <Card className="glass md:col-span-2">
      <CardContent className="pt-6 flex flex-col items-center justify-center h-64">
        <ChartBar className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1">No Analysis Data Available</h3>
        <p className="text-muted-foreground text-center">
          Detailed analysis will be available after the patient completes cognitive assessments.
        </p>
      </CardContent>
    </Card>
  );
};
