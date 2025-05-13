import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getDomainName } from "@/utils/dataProcessing";
import { SessionData } from "@/utils/mockData";
import { CognitiveDomain } from "@/utils/types/patientTypes";
import React, { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface DomainComparisonProps {
  patientData: CognitiveDomain;
  normativeData?: CognitiveDomain;
  subtypeData?: CognitiveDomain;
  sessions?: SessionData[];
}

export const DomainComparison: React.FC<DomainComparisonProps> = ({
  patientData,
  normativeData,
  subtypeData,
  sessions = [],
}) => {
  const domains = Object.keys(patientData) as (keyof CognitiveDomain)[];

  const isValidData = domains.every(
    (domain) =>
      typeof patientData[domain] === "number" && !isNaN(patientData[domain])
  );

  const normativeChartData = domains.map((domain) => {
    const patientValue =
      typeof patientData[domain] === "number" && !isNaN(patientData[domain])
        ? patientData[domain]
        : 0;

    const normativeValue =
      normativeData &&
      typeof normativeData[domain] === "number" &&
      !isNaN(normativeData[domain])
        ? normativeData[domain]
        : 50;

    const subtypeValue =
      subtypeData &&
      typeof subtypeData[domain] === "number" &&
      !isNaN(subtypeData[domain])
        ? subtypeData[domain]
        : 40;

    return {
      domain: getDomainName(domain),
      patient: patientValue,
      normative: normativeValue,
      subtype: subtypeValue,
    };
  });

  const firstAndLastSession = useMemo(() => {
    if (!sessions || sessions.length < 2) {
      return null;
    }

    const sortedSessions = [...sessions].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const firstSession = sortedSessions[0];
    const lastSession = sortedSessions[sortedSessions.length - 1];

    return { firstSession, lastSession };
  }, [sessions]);

  const sessionComparisonData = useMemo(() => {
    if (!firstAndLastSession) return [];

    const { firstSession, lastSession } = firstAndLastSession;

    return domains.map((domain) => {
      const firstValue =
        typeof firstSession.domainScores[domain] === "number"
          ? firstSession.domainScores[domain]
          : 0;

      const lastValue =
        typeof lastSession.domainScores[domain] === "number"
          ? lastSession.domainScores[domain]
          : 0;

      return {
        domain: getDomainName(domain),
        firstSession: firstValue,
        lastSession: lastValue,
      };
    });
  }, [firstAndLastSession, domains]);

  const hasSessionData =
    firstAndLastSession !== null && sessionComparisonData.length > 0;

  return (
    <Tabs defaultValue="normative" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="normative">Normative Comparison</TabsTrigger>
        <TabsTrigger value="progress" disabled={!hasSessionData}>
          Progress Comparison
        </TabsTrigger>
      </TabsList>

      <TabsContent value="normative">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Cognitive Domain Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-1.5" />
                <span className="text-xs">Patient</span>
              </div>
              {normativeData && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-1.5" />
                  <span className="text-xs">Age-Based Normative</span>
                </div>
              )}
              {subtypeData && (
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400 mr-1.5" />
                  <span className="text-xs">ADHD Subtype Average</span>
                </div>
              )}
            </div>

            <div className="h-[350px] w-full">
              {normativeChartData.length > 0 && isValidData && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="75%" data={normativeChartData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="domain"
                      tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 10,
                      }}
                      stroke="hsl(var(--border))"
                    />

                    {subtypeData && (
                      <Radar
                        name="ADHD Subtype Average"
                        dataKey="subtype"
                        stroke="rgb(251, 191, 36)"
                        fill="rgb(251, 191, 36)"
                        fillOpacity={0.5}
                      />
                    )}

                    {normativeData && (
                      <Radar
                        name="Age-Based Normative"
                        dataKey="normative"
                        stroke="rgb(96, 165, 250)"
                        fill="rgb(96, 165, 250)"
                        fillOpacity={0.5}
                      />
                    )}

                    <Radar
                      name="Patient"
                      dataKey="patient"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              )}
              {(!normativeChartData.length || !isValidData) && (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No valid data available for visualization
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="progress">
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              First vs. Last Session Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hasSessionData ? (
              <>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5" />
                    <span className="text-xs">First Session</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-violet-500 mr-1.5" />
                    <span className="text-xs">Latest Session</span>
                  </div>
                </div>

                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius="75%" data={sessionComparisonData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis
                        dataKey="domain"
                        tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{
                          fill: "hsl(var(--muted-foreground))",
                          fontSize: 10,
                        }}
                        stroke="hsl(var(--border))"
                      />
                      <Radar
                        name="First Session"
                        dataKey="firstSession"
                        stroke="rgb(16, 185, 129)"
                        fill="rgb(16, 185, 129)"
                        fillOpacity={0.5}
                      />
                      <Radar
                        name="Latest Session"
                        dataKey="lastSession"
                        stroke="rgb(139, 92, 246)"
                        fill="rgb(139, 92, 246)"
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="flex h-[350px] items-center justify-center text-muted-foreground">
                Not enough session data available for comparison
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
