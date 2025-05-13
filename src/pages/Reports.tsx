import { DomainComparison } from "@/components/analysis/DomainComparison";
import { PerformanceTrend } from "@/components/analysis/PerformanceTrend";
import { MetricTooltip } from "@/components/reports/MetricTooltip";
import { PatientReports } from "@/components/reports/PatientReports";
import { ReportGenerator } from "@/components/reports/ReportGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  metricsMap,
  mockNormativeData,
  mockSubtypeData,
  patients,
  reportsMap,
  ReportType,
  sessionsMap,
} from "@/utils/mockData";
import { format, parseISO } from "date-fns";
import { ChevronLeft, Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const defaultCognitiveDomain = {
  attention: 0,
  memory: 0,
  executiveFunction: 0,
  behavioral: 0,
};

const Reports: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [patientId, setPatientId] = useState<string | null>(null);
  const [patientReports, setPatientReports] = useState<ReportType[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("patient");

    if (id && patients.some((p) => p.id === id)) {
      setPatientId(id);
    } else if (patients.length > 0) {
      setPatientId(patients[0].id);
    }
  }, [location]);

  useEffect(() => {
    if (patientId) {
      const reports = reportsMap[patientId] || [];
      setPatientReports(reports);

      if (reports.length > 0 && !selectedReportId) {
        setSelectedReportId(reports[0].id);
      }
    }
  }, [patientId]);

  const handlePatientChange = (id: string) => {
    navigate(`/reports?patient=${id}`);
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  const handleReportGenerate = (report: ReportType) => {
    setPatientReports((prev) => [report, ...prev]);
    setSelectedReportId(report.id);
    setActiveTab("viewReport");
  };

  const handleViewReport = (report: ReportType) => {
    setSelectedReportId(report.id);
    setActiveTab("viewReport");
  };

  const generatePatientTrendData = (patientId: string, domain: string) => {
    const patientSessions = sessionsMap[patientId] || [];

    const sortedSessions = [...patientSessions].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return sortedSessions.map((session) => {
      const domainKey = domain as keyof typeof session.domainScores;
      return {
        date: format(parseISO(session.startTime), "yyyy-MM-dd"),
        score: session.domainScores[domainKey],
        duration: session.duration,
      };
    });
  };

  const generateSessionComparison = (patientId: string) => {
    const patientSessions = sessionsMap[patientId] || [];

    if (patientSessions.length < 2) return null;

    const sortedSessions = [...patientSessions].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    const firstSession = sortedSessions[0];
    const lastSession = sortedSessions[sortedSessions.length - 1];

    return [
      {
        metric: "Attention",
        first: firstSession.domainScores.attention,
        last: lastSession.domainScores.attention,
        change: (
          ((lastSession.domainScores.attention -
            firstSession.domainScores.attention) /
            firstSession.domainScores.attention) *
          100
        ).toFixed(0),
      },
      {
        metric: "Memory",
        first: firstSession.domainScores.memory,
        last: lastSession.domainScores.memory,
        change: (
          ((lastSession.domainScores.memory -
            firstSession.domainScores.memory) /
            firstSession.domainScores.memory) *
          100
        ).toFixed(0),
      },
      {
        metric: "Executive Function",
        first: firstSession.domainScores.executiveFunction,
        last: lastSession.domainScores.executiveFunction,
        change: (
          ((lastSession.domainScores.executiveFunction -
            firstSession.domainScores.executiveFunction) /
            firstSession.domainScores.executiveFunction) *
          100
        ).toFixed(0),
      },
      {
        metric: "Behavioral Regulation",
        first: firstSession.domainScores.behavioral,
        last: lastSession.domainScores.behavioral,
        change: (
          ((lastSession.domainScores.behavioral -
            firstSession.domainScores.behavioral) /
            firstSession.domainScores.behavioral) *
          100
        ).toFixed(0),
      },
      {
        metric: "Overall",
        first:
          (firstSession.domainScores.attention +
            firstSession.domainScores.memory +
            firstSession.domainScores.executiveFunction +
            firstSession.domainScores.behavioral) /
          4,
        last:
          (lastSession.domainScores.attention +
            lastSession.domainScores.memory +
            lastSession.domainScores.executiveFunction +
            lastSession.domainScores.behavioral) /
          4,
        change: (
          (((lastSession.domainScores.attention +
            lastSession.domainScores.memory +
            lastSession.domainScores.executiveFunction +
            lastSession.domainScores.behavioral) /
            4 -
            (firstSession.domainScores.attention +
              firstSession.domainScores.memory +
              firstSession.domainScores.executiveFunction +
              firstSession.domainScores.behavioral) /
              4) /
            ((firstSession.domainScores.attention +
              firstSession.domainScores.memory +
              firstSession.domainScores.executiveFunction +
              firstSession.domainScores.behavioral) /
              4)) *
          100
        ).toFixed(0),
      },
    ];
  };

  const generateImpulsivityData = (patientId: string) => {
    const patientSessions = sessionsMap[patientId] || [];

    const sortedSessions = [...patientSessions].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return sortedSessions.map((session) => {
      return {
        date: format(parseISO(session.startTime), "yyyy-MM-dd"),
        commissionErrors: Math.floor(Math.random() * 8),
        omissionErrors: Math.floor(Math.random() * 7),
      };
    });
  };

  const generateResponseTimeData = (patientId: string) => {
    const patientSessions = sessionsMap[patientId] || [];

    const sortedSessions = [...patientSessions].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return sortedSessions.map((session) => {
      return {
        date: format(parseISO(session.startTime), "yyyy-MM-dd"),
        responseTime: 0.5 + Math.random() * 2.5,
      };
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "Download started",
      description: "Your report PDF will download shortly.",
    });
  };

  const currentPatient = patients.find((p) => p.id === patientId);
  const patientMetrics = patientId ? metricsMap[patientId] : null;
  const selectedReport = patientReports.find((r) => r.id === selectedReportId);

  const memoryTrendData = patientId
    ? generatePatientTrendData(patientId, "memory")
    : [];
  const attentionTrendData = patientId
    ? generatePatientTrendData(patientId, "attention")
    : [];
  const executiveTrendData = patientId
    ? generatePatientTrendData(patientId, "executiveFunction")
    : [];
  const behavioralTrendData = patientId
    ? generatePatientTrendData(patientId, "behavioral")
    : [];
  const responseTimeData = patientId ? generateResponseTimeData(patientId) : [];
  const impulsivityData = patientId ? generateImpulsivityData(patientId) : [];
  const sessionComparison = patientId
    ? generateSessionComparison(patientId)
    : [];

  const patientSessions =
    patientId && sessionsMap[patientId]
      ? [...sessionsMap[patientId]].sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        )
      : [];

  if (!currentPatient || !patientMetrics) {
    return <div className="p-8">Loading patient data...</div>;
  }

  const getMetricExplanation = (metric: string): string => {
    const explanations: Record<string, string> = {
      attention:
        "Measures ability to focus on relevant tasks and ignore distractions. Higher scores indicate better sustained attention and selective focus.",
      memory:
        "Evaluates capacity to encode, store and retrieve information. Includes working memory, visual memory and sequence recall.",
      executiveFunction:
        "Assesses higher-order cognitive processes including planning, decision-making, cognitive flexibility and problem solving.",
      behavioral:
        "Measures impulse control, emotional regulation and appropriate response to environmental cues.",
      responseTime:
        "Average time taken to respond to stimuli. Lower times typically indicate better processing speed and attention.",
      commissionErrors:
        "Errors made by responding when should have withheld response - indicates impulsivity issues.",
      omissionErrors:
        "Missed responses when should have responded - indicates inattention issues.",
      cognitive:
        "Overall measurement of cognitive performance across all domains, weighted by relevance to daily functioning.",
      percentile:
        "Performance compared to normative data for same age and demographic group.",
      progress:
        "Percentage improvement across all cognitive domains over the specified time period.",
    };

    return explanations[metric] || "No explanation available for this metric.";
  };

  // Create default CognitiveDomain objects for the empty objects that were causing errors
  const defaultCognitiveDomain = {
    attention: 0,
    memory: 0,
    executiveFunction: 0,
    behavioral: 0,
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 -ml-2 text-muted-foreground"
              onClick={handleBackToDashboard}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold mb-2">
              Cognitive Assessment Reports
            </h1>
            <p className="text-muted-foreground">
              Generate and manage detailed cognitive assessment reports
            </p>
          </div>

          <div className="min-w-[200px]">
            <Select value={patientId || ""} onValueChange={handlePatientChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg border border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-muted-foreground block">
                Patient
              </span>
              <span className="font-medium">{currentPatient.name}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                Age / Gender
              </span>
              <span className="font-medium">
                {currentPatient.age} / {currentPatient.gender}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                Diagnosis Date
              </span>
              <span className="font-medium">
                {currentPatient.diagnosisDate}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">
                ADHD Subtype
              </span>
              <span className="font-medium">{currentPatient.adhdSubtype}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="reports">Patient Reports</TabsTrigger>
          <TabsTrigger value="viewReport" disabled={!selectedReport}>
            View Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  This cognitive assessment evaluates performance across four
                  key domains: Attention, Memory, Executive Function, and
                  Behavioral Regulation.
                </p>
                <p>
                  Results indicate relative strengths in Memory and Attention
                  domains, with opportunities for development in Executive
                  Function and Behavioral Regulation. Specific strategies are
                  recommended to support cognitive functioning in daily
                  activities.
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Domain Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <MetricTooltip
                      explanation={getMetricExplanation("attention")}
                    >
                      <Label>Attention</Label>
                    </MetricTooltip>
                    <span className="text-sm">{patientMetrics.attention}%</span>
                  </div>
                  <Progress value={patientMetrics.attention} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <MetricTooltip explanation={getMetricExplanation("memory")}>
                      <Label>Memory</Label>
                    </MetricTooltip>
                    <span className="text-sm">{patientMetrics.memory}%</span>
                  </div>
                  <Progress value={patientMetrics.memory} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <MetricTooltip
                      explanation={getMetricExplanation("executiveFunction")}
                    >
                      <Label>Executive Function</Label>
                    </MetricTooltip>
                    <span className="text-sm">
                      {patientMetrics.executiveFunction}%
                    </span>
                  </div>
                  <Progress
                    value={patientMetrics.executiveFunction}
                    className="h-2"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <MetricTooltip
                      explanation={getMetricExplanation("behavioral")}
                    >
                      <Label>Behavioral Regulation</Label>
                    </MetricTooltip>
                    <span className="text-sm">
                      {patientMetrics.behavioral}%
                    </span>
                  </div>
                  <Progress value={patientMetrics.behavioral} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <DomainComparison
            patientData={patientMetrics}
            normativeData={{ ...defaultCognitiveDomain, ...mockNormativeData }}
          />
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ReportGenerator
              patient={currentPatient}
              metrics={patientMetrics}
              onReportGenerate={handleReportGenerate}
            />

            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-lg">Report Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  The generated report will include comprehensive analysis of
                  cognitive performance based on the selected sections.
                </p>
                <p className="mb-4">
                  Reports can be shared with healthcare providers, educational
                  institutions, or other stakeholders through our secure
                  platform.
                </p>
                <p>
                  Each report is customized to address specific needs while
                  maintaining clinical accuracy and relevance.
                </p>
                <Separator className="my-4" />
                <h4 className="font-medium mb-2">Available Report Types</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 bg-primary"></div>
                    <span>
                      <strong>Clinical Report:</strong> Comprehensive assessment
                      for healthcare providers
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 bg-primary"></div>
                    <span>
                      <strong>School Accommodation:</strong> Focused on
                      educational support recommendations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 bg-primary"></div>
                    <span>
                      <strong>Progress Summary:</strong> Tracking changes over
                      time with trend analysis
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 mr-2 bg-primary"></div>
                    <span>
                      <strong>Detailed Analysis:</strong> In-depth breakdown of
                      all cognitive domains
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <PatientReports
            reports={patientReports}
            onViewReport={handleViewReport}
          />
        </TabsContent>

        <TabsContent value="viewReport" className="space-y-6">
          {selectedReport ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Clinical Assessment Report
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedReport.title} - Generated on{" "}
                    {format(
                      parseISO(selectedReport.createdDate),
                      "MMMM d, yyyy"
                    )}
                  </p>
                </div>
                <Button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF Report
                </Button>
              </div>

              <Card className="glass">
                <CardHeader>
                  <CardTitle>Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Overall assessment of {currentPatient.name}'s cognitive
                    performance and progress
                  </h3>

                  <p className="mb-4">
                    {currentPatient.name} has shown fluctuations in cognitive
                    performance over {patientSessions.length} weeks of
                    assessment. Key improvements include a{" "}
                    {sessionComparison?.[1]?.change || "0"}% increase in
                    sequence recall accuracy and
                    {sessionComparison?.[0]?.change || "0"}% improvement in
                    sustained attention.
                  </p>

                  <p>
                    The most significant growth has been observed in memory
                    tasks, while executive function shows room for further
                    development.
                  </p>

                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li className="text-muted-foreground">
                        Focus on executive function games to improve cognitive
                        flexibility
                      </li>
                      <li className="text-muted-foreground">
                        Continue with memory enhancement exercises to build on
                        current progress
                      </li>
                      <li className="text-muted-foreground">
                        Consider increasing difficulty levels gradually to
                        maintain engagement
                      </li>
                      <li className="text-muted-foreground">
                        Implement short, frequent sessions rather than longer,
                        less frequent ones
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <MetricTooltip explanation="These charts track progress over time in specific cognitive domains, showing trends and changes through sessions.">
                        Individual Metrics Over Time
                      </MetricTooltip>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Tracking progress across key cognitive domains
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        <MetricTooltip
                          explanation={getMetricExplanation("memory")}
                        >
                          Memory Progress
                        </MetricTooltip>
                      </h3>
                      <PerformanceTrend
                        data={memoryTrendData}
                        title=""
                        showDuration={false}
                      />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        <MetricTooltip
                          explanation={getMetricExplanation("responseTime")}
                        >
                          Attention Span & Response Time
                        </MetricTooltip>
                      </h3>
                      <PerformanceTrend
                        data={responseTimeData.map((item) => ({
                          date: item.date,
                          score:
                            attentionTrendData.find((a) => a.date === item.date)
                              ?.score || 0,
                          duration: item.responseTime * 1000,
                        }))}
                        title=""
                        showDuration={true}
                      />
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        <MetricTooltip explanation="This chart shows two types of errors: commission errors (acting when shouldn't - impulsivity) and omission errors (not acting when should - inattention).">
                          Impulsivity (Error Rates)
                        </MetricTooltip>
                      </h3>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={impulsivityData}
                            margin={{ top: 20, right: 5, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient
                                id="colorCommission"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="hsl(var(--destructive))"
                                  stopOpacity={0.2}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="hsl(var(--destructive))"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                              <linearGradient
                                id="colorOmission"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="hsl(var(--amber-500))"
                                  stopOpacity={0.2}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="hsl(var(--amber-500))"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              stroke="hsl(var(--border))"
                              vertical={false}
                            />
                            <XAxis
                              dataKey="date"
                              axisLine={false}
                              tickLine={false}
                              tickFormatter={(date) => {
                                const parts = date.split("-");
                                return `${parts[1]}/${parts[2]}`;
                              }}
                              stroke="hsl(var(--muted-foreground))"
                              tickMargin={10}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              stroke="hsl(var(--muted-foreground))"
                              tickMargin={10}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                borderColor: "hsl(var(--border))",
                                boxShadow: "var(--shadow)",
                                borderRadius: "var(--radius)",
                                color: "hsl(var(--foreground))",
                              }}
                              formatter={(value: number, name: string) => {
                                if (name === "commissionErrors")
                                  return [
                                    value,
                                    "Commission Errors (Impulsivity)",
                                  ];
                                if (name === "omissionErrors")
                                  return [
                                    value,
                                    "Omission Errors (Inattention)",
                                  ];
                                return [value, name];
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="commissionErrors"
                              name="commissionErrors"
                              stroke="hsl(var(--destructive))"
                              fillOpacity={1}
                              fill="url(#colorCommission)"
                              strokeWidth={2}
                              dot={{ r: 0 }}
                              activeDot={{
                                r: 6,
                                strokeWidth: 2,
                                stroke: "hsl(var(--background))",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="omissionErrors"
                              name="omissionErrors"
                              stroke="hsl(var(--amber-500))"
                              fillOpacity={1}
                              fill="url(#colorOmission)"
                              strokeWidth={2}
                              dot={{ r: 0 }}
                              activeDot={{
                                r: 6,
                                strokeWidth: 2,
                                stroke: "hsl(var(--background))",
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <MetricTooltip explanation="Direct comparison of scores from first session to most recent, showing percentage change. Positive values indicate improvement.">
                          Before vs. After Performance Comparison
                        </MetricTooltip>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {sessionComparison ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Metric</TableHead>
                                <TableHead>First Session</TableHead>
                                <TableHead>Latest Session</TableHead>
                                <TableHead>
                                  <MetricTooltip explanation="Percentage change between first and latest session. Positive values indicate improvement.">
                                    % Change
                                  </MetricTooltip>
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sessionComparison.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">
                                    <MetricTooltip
                                      explanation={getMetricExplanation(
                                        item.metric
                                          .toLowerCase()
                                          .replace(" ", "")
                                      )}
                                    >
                                      {item.metric}
                                    </MetricTooltip>
                                  </TableCell>
                                  <TableCell>{item.first.toFixed(1)}</TableCell>
                                  <TableCell>{item.last.toFixed(1)}</TableCell>
                                  <TableCell
                                    className={
                                      Number(item.change) > 0
                                        ? "text-green-600"
                                        : Number(item.change) < 0
                                        ? "text-red-600"
                                        : ""
                                    }
                                  >
                                    {Number(item.change) > 0
                                      ? `+${item.change}%`
                                      : `${item.change}%`}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted-foreground">
                            Not enough session data available for comparison
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <MetricTooltip explanation="Analysis comparing patient performance to peers and across different cognitive activities.">
                          Comparative Analysis
                        </MetricTooltip>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Cross-game performance insights and peer benchmarking
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h3 className="text-sm font-medium mb-2">
                          <MetricTooltip explanation="This radar chart shows performance across different games, broken down by key cognitive skills. Higher values indicate better performance.">
                            Cross-Game Cognitive Performance
                          </MetricTooltip>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This radar chart shows {currentPatient.name}'s
                          performance across different games, broken down by key
                          cognitive skills. Each axis represents a cognitive
                          domain, and higher values (further from center)
                          indicate better performance.
                        </p>
                      </div>

                      <DomainComparison
                        patientData={patientMetrics}
                        normativeData={{
                          ...defaultCognitiveDomain,
                          ...mockNormativeData,
                        }}
                        subtypeData={{
                          ...defaultCognitiveDomain,
                          ...mockSubtypeData,
                        }}
                        sessions={patientSessions}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab("reports")}
                >
                  Back to Reports
                </Button>
                <Button onClick={handleDownloadPDF}>Download PDF</Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No report selected</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
