
import React from 'react';
import { format, parseISO } from 'date-fns';
import { LineChartIcon, User, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { TrendData } from '@/services/patient';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PatientProfileProps {
  patientAgeGroup: string;
  patientAdhdSubtype: string | null;
  avgDomainScores: {
    memory: number;
    attention: number;
    impulse_control: number;
    executive_function: number;
  };
  trendGraph: TrendData[];
  totalSessions: number;
  firstSessionDate: string | null;
  lastSessionDate: string | null;
  age: number;
  gender: string;
  hasTrendData: boolean;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patientAgeGroup,
  patientAdhdSubtype,
  avgDomainScores,
  trendGraph,
  totalSessions,
  firstSessionDate,
  lastSessionDate,
  age,
  gender,
  hasTrendData
}) => {
  // Format date for XAxis
  const formatXAxis = (tickItem: string) => {
    try {
      return format(parseISO(tickItem), "MMM d");
    } catch (e) {
      return tickItem; // Fallback if parsing fails
    }
  };

  // Format score for Tooltip and YAxis
  const formatScore = (score: number) => {
    return Math.round(score * 10) / 10; // Round to 1 decimal place
  };

  // Determine color based on score value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };
  
  // Define chart colors for each domain
  const domainColors = {
    attention: "#8884d8", // Purple for attention
    memory: "#82ca9d",    // Green for memory
    impulse: "#ffc658",   // Yellow for impulse control
    executive: "#ff7300"  // Orange for executive function
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card - Patient Information */}
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Patient Profile</h2>
              <p className="text-muted-foreground">Age Group: {patientAgeGroup}</p>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-muted-foreground mb-1">Age</h3>
                <p className="font-medium">{age} years</p>
              </div>
              
              <div>
                <h3 className="text-sm text-muted-foreground mb-1">Gender</h3>
                <p className="font-medium">{gender}</p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  ADHD Subtype
                </h3>
                <Badge variant="outline">
                  {patientAdhdSubtype ?? "N/A"}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  Total Sessions
                </h3>
                <p className="font-medium">{totalSessions}</p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  First Session
                </h3>
                <p className="font-medium">
                  {firstSessionDate
                    ? format(
                        parseISO(firstSessionDate),
                        "MMM d, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-1">
                  Last Session
                </h3>
                <p className="font-medium">
                  {lastSessionDate
                    ? format(
                        parseISO(lastSessionDate),
                        "MMM d, yyyy"
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Card */}
        <Card className="glass">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">
              Average Domain Scores
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Memory</p>
                  <p className={`text-sm font-medium ${getScoreColor(avgDomainScores?.memory ?? 0)}`}>
                    {formatScore(avgDomainScores?.memory ?? 0)}
                  </p>
                </div>
                <Progress 
                  value={avgDomainScores?.memory ?? 0} 
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Attention</p>
                  <p className={`text-sm font-medium ${getScoreColor(avgDomainScores?.attention ?? 0)}`}>
                    {formatScore(avgDomainScores?.attention ?? 0)}
                  </p>
                </div>
                <Progress
                  value={avgDomainScores?.attention ?? 0}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Impulse Control</p>
                  <p className={`text-sm font-medium ${getScoreColor(avgDomainScores?.impulse_control ?? 0)}`}>
                    {formatScore(avgDomainScores?.impulse_control ?? 0)}
                  </p>
                </div>
                <Progress
                  value={avgDomainScores?.impulse_control ?? 0}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <p className="text-sm">Executive Function</p>
                  <p className={`text-sm font-medium ${getScoreColor(avgDomainScores?.executive_function ?? 0)}`}>
                    {formatScore(avgDomainScores?.executive_function ?? 0)}
                  </p>
                </div>
                <Progress
                  value={avgDomainScores?.executive_function ?? 0}
                  className="h-2"
                />
              </div>
            </div>

            {totalSessions === 0 && (
              <Alert className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No Sessions</AlertTitle>
                <AlertDescription>
                  This patient has no recorded sessions yet. Scores will be updated after the first session.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Trend Graph in Profile Tab */}
      <div className="mt-6">
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Cognitive Score Trends</h3>
              <LineChartIcon className="h-5 w-5 text-muted-foreground" />
            </div>

            {!hasTrendData ? (
              <div className="p-8 text-center h-64 flex flex-col justify-center items-center">
                <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">
                  No session data available to display trends.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Trends will appear after the patient completes sessions.
                </p>
              </div>
            ) : (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={trendGraph}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <defs>
                      <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={domainColors.attention} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={domainColors.attention} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={domainColors.memory} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={domainColors.memory} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorImpulse" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={domainColors.impulse} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={domainColors.impulse} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExecutive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={domainColors.executive} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={domainColors.executive} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="session_date" 
                      tickFormatter={formatXAxis}
                      axisLine={false}
                      tickLine={false}
                      tickMargin={10} 
                      fontSize={12}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis 
                      fontSize={12}
                      tickMargin={5}
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        boxShadow: 'var(--shadow)',
                        borderRadius: 'var(--radius)',
                        color: 'hsl(var(--foreground))'
                      }}
                      formatter={(value: number) => [`${formatScore(value)}`, '']}
                      labelFormatter={(label: string) => format(parseISO(label), "MMM d, yyyy")}
                    />
                    <Legend />
                    <ReferenceLine y={60} stroke="hsl(var(--muted))" strokeDasharray="3 3" />
                    <Area 
                      type="monotone" 
                      dataKey="attention_score" 
                      stroke={domainColors.attention} 
                      name="Attention"
                      fillOpacity={1}
                      fill="url(#colorAttention)"
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="memory_score" 
                      stroke={domainColors.memory} 
                      name="Memory"
                      fillOpacity={1}
                      fill="url(#colorMemory)"
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="impulse_score" 
                      stroke={domainColors.impulse} 
                      name="Impulse"
                      fillOpacity={1}
                      fill="url(#colorImpulse)"
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="executive_score" 
                      stroke={domainColors.executive} 
                      name="Executive"
                      fillOpacity={1}
                      fill="url(#colorExecutive)"
                      strokeWidth={2}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: 'hsl(var(--background))' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
