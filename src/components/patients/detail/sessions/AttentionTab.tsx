
import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { TrendData } from '@/services/patient';
import SessionService from '@/services/session';

interface AttentionTabProps {
  session: TrendData;
  expandedDomain: string | null;
  toggleDomainDetails: (domain: string) => void;
  getScoreColor: (score: number) => string;
  formatScore: (score: number) => number;
  formatPercentile: (percentile: number) => string;
  getClassificationStyle: (classification: string) => string;
}

export const AttentionTab: React.FC<AttentionTabProps> = ({
  session,
  expandedDomain,
  toggleDomainDetails,
  getScoreColor,
  formatScore,
  formatPercentile,
  getClassificationStyle
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attentionDetails, setAttentionDetails] = useState<any>(null);
  
  // Get the session ID directly from the session_id property
  const sessionId = session.session_id;

  // Fetch attention details when the tab is expanded, not on every render
  useEffect(() => {
    if (expandedDomain === 'attention' && sessionId && !attentionDetails) {
      setLoading(true);
      setError(null);
      
      console.log('AttentionTab - Fetching attention details for session ID:', sessionId);
      
      SessionService.getSessionDomainDetails(sessionId, 'attention')
        .then(data => {
          setAttentionDetails(data);
          console.log('AttentionTab - Fetched attention details:', data);
        })
        .catch(err => {
          console.error('AttentionTab - Error fetching attention details:', err);
          setError('Failed to load attention details.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [expandedDomain, sessionId, attentionDetails]);

  // Fallback to session data if API fetch fails
  const details = attentionDetails || session?.attention_details;

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading attention details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>No detailed attention data available for this session</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md">
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Overall Score</div>
          <div className={`text-xl font-bold ${getScoreColor(details.overall_score)}`}>
            {formatScore(details.overall_score)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Percentile</div>
          <div className="text-xl font-bold">
            {formatPercentile(details.percentile)}
          </div>
        </div>
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Classification</div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationStyle(details.classification)}`}>
            {details.classification}
          </span>
        </div>
      </div>
      
      <div>
        <div className="font-medium mb-3 text-sm">Components</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.components && Object.entries(details.components || {}).map(([key, value]) => (
            <div key={key} className="border rounded-md p-3 bg-background shadow-sm">
              <div className="flex justify-between">
                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                <span className={`font-bold ${getScoreColor(typeof value === 'number' ? value : 0)}`}>
                  {typeof value === 'number' ? formatScore(value) : String(value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {details.tasks_used && (
        <div>
          <div className="text-sm font-medium mb-2">Tasks Used</div>
          <div className="flex flex-wrap gap-2">
            {details.tasks_used.map((task: string, i: number) => (
              <span key={i} className="bg-primary/10 px-2 py-1 rounded-full text-xs font-medium text-primary">
                {task}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {typeof details.data_completeness !== 'undefined' && (
        <div>
          <div className="text-sm font-medium mb-2">Data Completeness</div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${typeof details.data_completeness === 'number' ? details.data_completeness * 100 : details.data_completeness}%` }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {typeof details.data_completeness === 'number' 
              ? `${Math.round(details.data_completeness * 100)}% complete` 
              : `${details.data_completeness}% complete`}
          </div>
        </div>
      )}
    </div>
  );
};
