
import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendData } from '@/services/patient';
import SessionService from '@/services/session';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface MemoryTabProps {
  session: TrendData;
  expandedDomain: string | null;
  toggleDomainDetails: (domain: string) => void;
  getScoreColor: (score: number) => string;
  formatScore: (score: number) => number;
  formatPercentile: (percentile: number) => string;
  getClassificationStyle: (classification: string) => string;
}

export const MemoryTab: React.FC<MemoryTabProps> = ({
  session,
  expandedDomain,
  toggleDomainDetails,
  getScoreColor,
  formatScore,
  formatPercentile,
  getClassificationStyle
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memoryDetails, setMemoryDetails] = useState<any>(null);
  
  const sessionId = session.session_id;

  // Fetch memory details whenever the tab is active
  useEffect(() => {
    if (sessionId) {
      setLoading(true);
      setError(null);
      
      console.log('MemoryTab - Fetching memory details for session ID:', sessionId);
      
      SessionService.getSessionDomainDetails(sessionId, 'memory')
        .then(data => {
          console.log('MemoryTab - Fetched memory details:', data);
          if (data) {
            setMemoryDetails(data);
          } else {
            setError('No memory data returned from API.');
          }
        })
        .catch(err => {
          console.error('Error fetching memory details:', err);
          setError('Failed to load memory details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [sessionId]);

  // Combine fetched data with session data if available
  const details = memoryDetails || (session.memory_details || null);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-8 w-36" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="shadow-sm border-red-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-red-500">
            <AlertCircle className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
            <p>{error}</p>
            <Button 
              className="mt-4" 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!details) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Info className="h-12 w-12 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Memory Data Available</h3>
            <p className="text-center max-w-md">
              No detailed memory assessment data is available for this session. 
              The patient may not have completed memory-focused assessments.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4 border-b pb-2">Memory Assessment Summary</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div className="bg-background p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium mb-1">Overall Score</div>
              <div className="flex items-center justify-between">
                <div className={`text-2xl font-bold ${getScoreColor(details.overall_score)}`}>
                  {formatScore(details.overall_score)}
                </div>
                <InfoTooltip text="Combined score from all memory assessments" size="sm" />
              </div>
              <Progress 
                value={details.overall_score} 
                className="h-2 mt-2"
                indicatorClassName={getProgressColor(details.overall_score)}
              />
            </div>
            
            <div className="bg-background p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium mb-1">Percentile Rank</div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {formatPercentile(details.percentile)}
                </div>
                <InfoTooltip text="Performance compared to peers in the same age group" size="sm" />
              </div>
              <Progress 
                value={details.percentile} 
                className="h-2 mt-2"
                indicatorClassName={getProgressColor(details.percentile)}
              />
            </div>
            
            <div className="bg-background p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium mb-1">Classification</div>
              <div className="flex items-center justify-between">
                <div className={`text-lg font-semibold px-3 py-1 rounded-full ${getClassificationStyle(details.classification)}`}>
                  {details.classification}
                </div>
                <InfoTooltip text="Clinical interpretation of memory performance" size="sm" />
              </div>
            </div>
          </div>
          
          <h4 className="font-medium text-lg mb-3">Memory Components</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {details.components && Object.entries(details.components).map(([key, component]: [string, any]) => (
              <div key={key} className="bg-background rounded-lg shadow-sm border overflow-hidden">
                <div className="bg-muted/30 px-4 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium capitalize">{formatComponentName(key)}</h5>
                    <div className={`text-lg font-semibold ${getScoreColor(component.score)}`}>
                      {formatScore(component.score)}
                    </div>
                  </div>
                  <Progress 
                    value={component.score} 
                    className="h-1.5 mt-2" 
                    indicatorClassName={getProgressColor(component.score)}
                  />
                </div>
                
                <div className="p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-2"
                    onClick={() => toggleDomainDetails(key)}
                  >
                    {expandedDomain === key ? 'Hide Details' : 'Show Details'}
                    {expandedDomain === key ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
                  </Button>
                  
                  {expandedDomain === key && component.components && (
                    <div className="mt-4 animate-fade-in">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Subcomponent</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(component.components).map(([subKey, value]: [string, any]) => (
                            <TableRow key={subKey}>
                              <TableCell className="capitalize">{formatComponentName(subKey)}</TableCell>
                              <TableCell className="text-right">
                                <span className={getScoreColor(typeof value === 'number' ? value : 0)}>
                                  {typeof value === 'number' ? formatScore(value) : String(value)}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Assessment Tasks</h4>
              <div className="bg-background p-4 rounded-lg shadow-sm border">
                {details.tasks_used && details.tasks_used.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {details.tasks_used.map((task: string, i: number) => (
                      <div key={i} className="bg-primary/10 px-3 py-1.5 rounded-full text-sm font-medium text-primary">
                        {task}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specific tasks recorded</p>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Data Completeness</h4>
              <div className="bg-background p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Assessment completeness</span>
                  <span className="font-medium">
                    {typeof details.data_completeness === 'number' 
                      ? `${Math.round(details.data_completeness * 100)}%` 
                      : `${details.data_completeness}%`}
                  </span>
                </div>
                <Progress 
                  value={typeof details.data_completeness === 'number' 
                    ? details.data_completeness * 100 
                    : parseFloat(details.data_completeness)}
                  className="h-2"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function for formatting component names
const formatComponentName = (name: string): string => {
  return name
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function for progress bar colors
const getProgressColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 70) return 'bg-emerald-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 50) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};
