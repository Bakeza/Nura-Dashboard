
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, CalendarClock, Clock, Laptop, MapPin } from 'lucide-react';
import { SessionData } from '@/utils/mockData';
import { formatDuration, getScoreBgClass, getScoreColorClass } from '@/utils/dataProcessing';
import { format, parseISO } from 'date-fns';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface SessionAnalysisProps {
  session: SessionData;
}

export const SessionAnalysis: React.FC<SessionAnalysisProps> = ({ session }) => {
  const formattedDate = format(parseISO(session.startTime), 'MMMM d, yyyy');
  const formattedTime = format(parseISO(session.startTime), 'h:mm a');
  const scoreColorClass = getScoreColorClass(session.overallScore);
  const scoreBgClass = getScoreBgClass(session.overallScore);
  
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Session Overview</CardTitle>
          <div className="flex items-center gap-1">
            <Badge 
              variant={session.completionStatus === 'Completed' ? 'default' : 'outline'}
              className={session.completionStatus !== 'Completed' ? 'text-amber-500' : ''}
            >
              {session.completionStatus}
            </Badge>
            <InfoTooltip 
              text={
                session.completionStatus === 'Completed' 
                  ? "Session was completed successfully with all activities finished" 
                  : "Session was started but not all activities were completed"
              }
              size="sm"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <CalendarClock className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{formattedDate}</p>
                <p className="text-xs text-muted-foreground">{formattedTime}</p>
              </div>
              <InfoTooltip 
                text="Date and time when the session was started"
                className="ml-2"
                size="sm"
              />
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{formatDuration(session.duration)}</p>
                <p className="text-xs text-muted-foreground">Session Duration</p>
              </div>
              <InfoTooltip 
                text="Total time spent in this session across all activities"
                className="ml-2"
                size="sm"
              />
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{session.environment}</p>
                <p className="text-xs text-muted-foreground">Environment</p>
              </div>
              <InfoTooltip 
                text="Physical setting where the session was conducted"
                className="ml-2"
                size="sm"
              />
            </div>
            
            <div className="flex items-center">
              <Laptop className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{session.device}</p>
                <p className="text-xs text-muted-foreground">Device</p>
              </div>
              <InfoTooltip 
                text="Hardware device used for the session"
                className="ml-2"
                size="sm"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-5 rounded-lg border border-border mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-medium">Overall Performance</h3>
              <InfoTooltip text="Combined weighted score calculated from all activities completed in this session" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Combined score across all activities
            </p>
          </div>
          <div className={`${scoreBgClass} px-3 py-1.5 rounded-full`}>
            <span className={`text-xl font-bold ${scoreColorClass}`}>
              {Math.round(session.overallScore)}%
            </span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium">Domain Breakdown</h3>
            <InfoTooltip text="Performance breakdown by cognitive domain, showing strengths and areas for development" />
          </div>
          <div className="space-y-4">
            {(Object.keys(session.domainScores) as (keyof typeof session.domainScores)[]).map(domain => {
              const score = session.domainScores[domain];
              
              // Domain specific explanations
              const getDomainExplanation = () => {
                switch(domain) {
                  case 'attention':
                    return "Ability to focus on relevant tasks and ignore distractions";
                  case 'memory':
                    return "Capacity to encode, store, and retrieve information";
                  case 'executiveFunction':
                    return "Higher-order processes like planning, decision-making, and cognitive flexibility";
                  case 'behavioral':
                    return "Impulse control and emotional regulation abilities";
                  default:
                    return "Performance in this cognitive domain";
                }
              };
              
              return (
                <div key={domain} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-cognitive-${domain}`} />
                    <span className="text-sm">
                      {domain === 'executiveFunction' ? 'Executive Function' : domain.charAt(0).toUpperCase() + domain.slice(1)}
                    </span>
                    <InfoTooltip text={getDomainExplanation()} size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-cognitive-${domain} rounded-full`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getScoreColorClass(score)}`}>
                      {Math.round(score)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
