
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { SessionData } from '@/utils/mockData';
import { formatDuration, processSessionsForTimeline } from '@/utils/dataProcessing';

interface SessionTimelineProps {
  sessions: SessionData[];
  title?: string;
}

export const SessionTimeline: React.FC<SessionTimelineProps> = ({ 
  sessions, 
  title = 'Session Progress' 
}) => {
  // Process data for the chart
  const timelineData = processSessionsForTimeline(sessions);
  
  // Calculate sessions statistics
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, session) => sum + session.duration, 0);
  const averageScore = Math.round(
    sessions.reduce((sum, session) => sum + session.overallScore, 0) / sessions.length
  );
  
  return (
    <Card className="glass">
      <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Sessions</span>
            <span className="text-base sm:text-xl font-semibold truncate">{totalSessions}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Duration</span>
            <span className="text-base sm:text-xl font-semibold truncate">{formatDuration(totalDuration)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Average Score</span>
            <span className="text-base sm:text-xl font-semibold truncate">{averageScore}%</span>
          </div>
        </div>
        
        <div className="h-[200px] sm:h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timelineData}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(date) => {
                  const parts = date.split('-');
                  return `${parts[1]}/${parts[2]}`;
                }}
                stroke="hsl(var(--muted-foreground))"
                tickMargin={10}
                tick={{ fontSize: '10px' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                tickMargin={10}
                tick={{ fontSize: '10px' }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  boxShadow: 'var(--shadow)',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--foreground))',
                  fontSize: '12px',
                  padding: '8px',
                  zIndex: 1000
                }}
                formatter={(value: number) => [`${value}%`, 'Score']}
                labelStyle={{ fontSize: '11px' }}
                wrapperStyle={{ zIndex: 1000 }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                dot={{ r: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
