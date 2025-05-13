
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid
} from 'recharts';
import { CognitiveDomain as CognitiveDomainType } from '@/utils/mockData';
import { 
  getDomainBgColor, 
  getDomainColor, 
  getDomainName, 
  getScoreColorClass,
  getScoreStatus 
} from '@/utils/dataProcessing';

interface CognitiveDomainProps {
  domain: keyof CognitiveDomainType;
  score: number;
  trendData: Array<{date: string; value: number}>;
}

export const CognitiveDomain: React.FC<CognitiveDomainProps> = ({
  domain,
  score,
  trendData
}) => {
  const formattedTrendData = trendData.map(item => ({
    ...item,
    date: item.date.substring(5) // Remove year part
  }));
  
  const latestScore = formattedTrendData[formattedTrendData.length - 1]?.value || score;
  const firstScore = formattedTrendData[0]?.value || latestScore;
  const improvement = Math.round((latestScore - firstScore) * 10) / 10;
  
  const colorClass = getDomainColor(domain);
  const bgColorClass = getDomainBgColor(domain);
  const scoreColorClass = getScoreColorClass(score);
  const scoreStatus = getScoreStatus(score);
  
  // Domain-specific insights
  const insights = getDomainInsights(domain, score);
  
  return (
    <Card className="glass overflow-hidden">
      <CardHeader className={`${bgColorClass} pb-2`}>
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg ${colorClass}`}>{getDomainName(domain)}</CardTitle>
          <Badge 
            className={`${scoreColorClass} bg-white`}
            variant="outline"
          >
            {Math.round(score)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedTrendData}
              margin={{ top: 15, right: 5, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                stroke="hsl(var(--muted-foreground))"
                tickMargin={8}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                tickMargin={8}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  boxShadow: 'var(--shadow)',
                  borderRadius: 'var(--radius)',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: number) => [`${value}%`, getDomainName(domain)]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={`hsl(var(--cognitive-${domain}))`}
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                dot={{ r: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-between mt-1 mb-3">
          <div className="text-sm text-muted-foreground">
            90-day progress
          </div>
          <div className="flex items-center text-sm">
            {improvement > 0 ? (
              <Badge variant="outline" className="font-normal text-emerald-600 bg-emerald-50">
                +{improvement}% Improvement
              </Badge>
            ) : (
              <Badge variant="outline" className="font-normal text-amber-600 bg-amber-50">
                {improvement}% Change
              </Badge>
            )}
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-2">
          <h4 className="font-semibold">Key Observations</h4>
          <ul className="text-sm space-y-1.5">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 mr-2 ${colorClass}`}></div>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get domain-specific insights
const getDomainInsights = (domain: keyof CognitiveDomainType, score: number): string[] => {
  if (score < 60) {
    switch (domain) {
      case 'attention':
        return [
          'Difficulty maintaining sustained attention during extended tasks',
          'Increased susceptibility to distractions in the environment',
          'Inconsistent performance over time with fluctuating focus'
        ];
      case 'memory':
        return [
          'Challenges with working memory tasks requiring information retention',
          'Difficulty recalling sequential information accurately',
          'Better performance with visual memory compared to verbal memory'
        ];
      case 'executiveFunction':
        return [
          'Struggles with planning and organizing multi-step activities',
          'Difficulty adjusting to changing task requirements',
          'Challenges with inhibitory control in response-based activities'
        ];
      case 'behavioral':
        return [
          'Exhibits impulsive responses before fully processing information',
          'Difficulty managing frustration during challenging tasks',
          'Inconsistent self-monitoring during extended activities'
        ];
      default:
        return [];
    }
  } else {
    switch (domain) {
      case 'attention':
        return [
          'Shows good sustained attention across multiple activities',
          'Successfully filters distractions during focused tasks',
          'Consistent performance across different attention requirements'
        ];
      case 'memory':
        return [
          'Strong working memory capabilities across varied tasks',
          'Effectively retains and manipulates information when needed',
          'Shows appropriate memory strategies during complex tasks'
        ];
      case 'executiveFunction':
        return [
          'Demonstrates effective planning and organizational skills',
          'Good cognitive flexibility when adapting to changing requirements',
          'Shows appropriate inhibitory control during challenging activities'
        ];
      case 'behavioral':
        return [
          'Maintains appropriate response control during activities',
          'Manages frustration effectively during challenging segments',
          'Shows consistent self-monitoring throughout sessions'
        ];
      default:
        return [];
    }
  }
};
