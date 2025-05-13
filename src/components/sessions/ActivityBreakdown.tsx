
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { SessionData } from '@/utils/mockData';
import { formatDuration, getScoreColorClass } from '@/utils/dataProcessing';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface ActivityBreakdownProps {
  session: SessionData;
}

export const ActivityBreakdown: React.FC<ActivityBreakdownProps> = ({ session }) => {
  // Process activities data for the chart
  const activityData = session.activities.map(activity => ({
    name: activity.type,
    score: activity.score,
    duration: activity.duration,
    difficulty: activity.difficulty
  }));

  // Tooltip helper component
  const InfoTooltip = ({ content, children }: { content: string; children: React.ReactNode }) => (
    <TooltipProvider>
      <UITooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground opacity-70" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );
  
  // Get activity explanation
  const getActivityExplanation = (activityType: string): string => {
    switch (activityType) {
      case 'Attention Farming':
        return "Tests sustained attention by requiring users to maintain focus on specific targets over time.";
      case 'Memory Sequence':
        return "Assesses working memory by challenging users to recall and reproduce sequences of increasing length.";
      case 'Card Matching':
        return "Evaluates visual memory through pattern recognition and recall of spatial locations.";
      case 'Response Inhibition':
        return "Measures inhibitory control by requiring users to suppress automatic responses.";
      case 'Task Switching':
        return "Tests cognitive flexibility by requiring users to shift between different rules or tasks.";
      default:
        return "Exercise targeting multiple cognitive domains.";
    }
  };
  
  // Get difficulty explanation
  const getDifficultyExplanation = (level: number): string => {
    switch (level) {
      case 1: return "Very easy - introductory level suitable for beginners";
      case 2: return "Easy - gentle challenge requiring basic skills";
      case 3: return "Moderate - balanced challenge for average users";
      case 4: return "Challenging - requires strong cognitive abilities";
      case 5: return "Very difficult - designed to test mastery of skills";
      default: return `Difficulty level ${level} out of 5`;
    }
  };
  
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <InfoTooltip content="Detailed analysis of each activity performed during this session, including scores and duration">
          <CardTitle className="text-lg">Activity Breakdown</CardTitle>
        </InfoTooltip>
      </CardHeader>
      <CardContent>
        <InfoTooltip content="Chart comparing performance scores across different activities in this session">
          <div className="h-[250px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  tickMargin={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  tickMargin={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    boxShadow: 'var(--shadow)',
                    borderRadius: 'var(--radius)',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Score']}
                />
                <Bar 
                  dataKey="score" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </InfoTooltip>
        
        <div className="space-y-4">
          {session.activities.map(activity => (
            <div key={activity.id} className="p-4 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-3">
                <InfoTooltip content={getActivityExplanation(activity.type)}>
                  <h4 className="font-medium">{activity.type}</h4>
                </InfoTooltip>
                <div className="flex items-center gap-2">
                  <InfoTooltip content={getDifficultyExplanation(activity.difficulty)}>
                    <Badge variant="outline">
                      Difficulty: {activity.difficulty}/5
                    </Badge>
                  </InfoTooltip>
                  <InfoTooltip content="Percentage score achieved in this activity">
                    <span className={`font-medium ${getScoreColorClass(activity.score)}`}>
                      {Math.round(activity.score)}%
                    </span>
                  </InfoTooltip>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoTooltip content="Total time spent completing this activity">
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-medium">{formatDuration(activity.duration)}</p>
                  </div>
                </InfoTooltip>
                <InfoTooltip content="Primary cognitive domain targeted by this activity">
                  <div>
                    <p className="text-muted-foreground">Activity Type</p>
                    <p className="font-medium">{getActivityCognitiveFocus(activity.type)}</p>
                  </div>
                </InfoTooltip>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get cognitive focus for each activity type
const getActivityCognitiveFocus = (activityType: string): string => {
  switch (activityType) {
    case 'Attention Farming':
      return 'Sustained Attention';
    case 'Memory Sequence':
      return 'Working Memory';
    case 'Card Matching':
      return 'Visual Memory';
    case 'Response Inhibition':
      return 'Inhibitory Control';
    case 'Task Switching':
      return 'Cognitive Flexibility';
    default:
      return 'Multiple Domains';
  }
};
