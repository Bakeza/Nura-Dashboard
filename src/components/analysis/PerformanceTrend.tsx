
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { formatDuration } from '@/utils/dataProcessing';

interface TrendDataPoint {
  date: string;
  score: number;
  duration?: number;
}

interface PerformanceTrendProps {
  data: TrendDataPoint[];
  title: string;
  description?: string;
  showDuration?: boolean;
  domainColor?: string;
}

export const PerformanceTrend: React.FC<PerformanceTrendProps> = ({
  data,
  title,
  description,
  showDuration = false,
  domainColor
}) => {
  // Domain-specific colors
  const getDomainColors = () => {
    switch(title) {
      case 'Attention Domain':
        return {
          gradient1: 'hsl(var(--cognitive-attention))',
          gradient2: 'hsl(var(--cognitive-attention))',
          durationGradient1: 'hsl(221deg 79% 70%)',
          durationGradient2: 'hsl(221deg 79% 70%)',
        };
      case 'Memory Domain':
        return {
          gradient1: 'hsl(var(--cognitive-memory))',
          gradient2: 'hsl(var(--cognitive-memory))',
          durationGradient1: 'hsl(43deg 92% 65%)',
          durationGradient2: 'hsl(43deg 92% 65%)',
        };
      case 'Executive Function Domain':
        return {
          gradient1: 'hsl(var(--cognitive-executive))',
          gradient2: 'hsl(var(--cognitive-executive))',
          durationGradient1: 'hsl(142deg 67% 52%)',
          durationGradient2: 'hsl(142deg 67% 52%)',
        };
      case 'Impulse Control Domain':
        return {
          gradient1: 'hsl(var(--cognitive-behavioral))',
          gradient2: 'hsl(var(--cognitive-behavioral))',
          durationGradient1: 'hsl(325deg 75% 63%)',
          durationGradient2: 'hsl(325deg 75% 63%)',
        };
      default:
        return {
          gradient1: domainColor || 'hsl(var(--primary))',
          gradient2: domainColor || 'hsl(var(--primary))',
          durationGradient1: 'hsl(var(--muted-foreground))',
          durationGradient2: 'hsl(var(--muted-foreground))',
        };
    }
  };

  const colors = getDomainColors();
  const gradientId = `color${title.replace(/\s+/g, '')}`;
  const durationGradientId = `duration${title.replace(/\s+/g, '')}`;

  return (
    <Card className="glass overflow-hidden border-opacity-30 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.gradient1} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colors.gradient2} stopOpacity={0.05} />
                </linearGradient>
                {showDuration && (
                  <linearGradient id={durationGradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.durationGradient1} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.durationGradient2} stopOpacity={0.05} />
                  </linearGradient>
                )}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.3} />
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
                fontSize={11}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                tickMargin={10}
                fontSize={11}
              />
              {showDuration && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 'dataMax + 500']}
                  stroke="hsl(var(--muted-foreground))"
                  tickMargin={10}
                  tickFormatter={(seconds) => `${Math.floor(seconds / 60)}m`}
                  fontSize={11}
                />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))',
                  padding: '8px 12px',
                  fontSize: '12px'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'score') return [`${value}%`, 'Score'];
                  if (name === 'duration') return [formatDuration(value), 'Duration'];
                  return [value, name];
                }}
                labelFormatter={(label) => {
                  const parts = label.split('-');
                  const month = new Date(`${parts[0]}-${parts[1]}-01`).toLocaleString('default', { month: 'short' });
                  return `${month} ${parts[2]}, ${parts[0]}`;
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                name="score"
                stroke={colors.gradient1}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                strokeWidth={2.5}
                dot={{ r: 0 }}
                activeDot={{ 
                  r: 6,
                  strokeWidth: 2, 
                  stroke: 'hsl(var(--background))',
                  fill: colors.gradient1
                }}
              />
              {showDuration && (
                <Area
                  type="monotone"
                  dataKey="duration"
                  name="duration"
                  stroke={colors.durationGradient1}
                  fillOpacity={1}
                  fill={`url(#${durationGradientId})`}
                  strokeWidth={2}
                  dot={{ r: 0 }}
                  activeDot={{ 
                    r: 4, 
                    strokeWidth: 2, 
                    stroke: 'hsl(var(--background))',
                    fill: colors.durationGradient1
                  }}
                  yAxisId="right"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
