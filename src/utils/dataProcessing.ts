import { differenceInDays, format, parseISO } from "date-fns";
import { CognitiveDomain, PatientMetrics, SessionData } from "./mockData";

// Format percentile value with "th", "st", "nd", or "rd" suffix
export const formatPercentile = (percentile: number): string => {
  if (percentile > 10 && percentile < 20) return `${percentile}th`;

  const lastDigit = percentile % 10;
  switch (lastDigit) {
    case 1:
      return `${percentile}st`;
    case 2:
      return `${percentile}nd`;
    case 3:
      return `${percentile}rd`;
    default:
      return `${percentile}th`;
  }
};

// Format time duration from seconds to readable format
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
};

// Get score status based on value range
export const getScoreStatus = (
  score: number
): "critical" | "concern" | "moderate" | "good" | "excellent" => {
  if (score < 40) return "critical";
  if (score < 60) return "concern";
  if (score < 75) return "moderate";
  if (score < 90) return "good";
  return "excellent";
};

// Get color class based on score status
export const getScoreColorClass = (score: number): string => {
  const status = getScoreStatus(score);
  switch (status) {
    case "critical":
      return "text-red-600";
    case "concern":
      return "text-amber-500";
    case "moderate":
      return "text-yellow-500";
    case "good":
      return "text-emerald-500";
    case "excellent":
      return "text-blue-600";
    default:
      return "text-gray-500";
  }
};

// Get color class for the background based on score status
export const getScoreBgClass = (score: number): string => {
  const status = getScoreStatus(score);
  switch (status) {
    case "critical":
      return "bg-red-100";
    case "concern":
      return "bg-amber-100";
    case "moderate":
      return "bg-yellow-100";
    case "good":
      return "bg-emerald-100";
    case "excellent":
      return "bg-blue-100";
    default:
      return "bg-gray-100";
  }
};

// Calculate the change in metrics between two periods
export const calculateMetricsChange = (
  current: number,
  previous: number
): { value: number; isImprovement: boolean } => {
  const change = current - previous;
  return {
    value: Math.abs(change),
    isImprovement: change > 0,
  };
};

export const formatLastSession = (dateStr?: string): string => {
  if (!dateStr) return "Unknown";

  try {
    const date = parseISO(dateStr);
    const daysDiff = differenceInDays(new Date(), date);

    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "Yesterday";
    if (daysDiff < 7) return `${daysDiff} days ago`;
    if (daysDiff < 30) return `${Math.floor(daysDiff / 7)} weeks ago`;
    return `${Math.floor(daysDiff / 30)} months ago`;
  } catch (err) {
    console.error("Invalid date passed to formatLastSession:", dateStr);
    return "Invalid Date";
  }
};

// Get domain color based on domain name
export const getDomainColor = (domain: keyof CognitiveDomain): string => {
  switch (domain) {
    case "attention":
      return "text-cognitive-attention";
    case "memory":
      return "text-cognitive-memory";
    case "executiveFunction":
      return "text-cognitive-executive";
    case "behavioral":
      return "text-cognitive-behavioral";
    default:
      return "text-gray-500";
  }
};

// Get domain background color based on domain name
export const getDomainBgColor = (domain: keyof CognitiveDomain): string => {
  switch (domain) {
    case "attention":
      return "bg-cognitive-attention/10";
    case "memory":
      return "bg-cognitive-memory/10";
    case "executiveFunction":
      return "bg-cognitive-executive/10";
    case "behavioral":
      return "bg-cognitive-behavioral/10";
    default:
      return "bg-gray-100";
  }
};

// Get readable domain name
export const getDomainName = (domain: keyof CognitiveDomain): string => {
  switch (domain) {
    case "attention":
      return "Attention";
    case "memory":
      return "Memory";
    case "executiveFunction":
      return "Executive Function";
    case "behavioral":
      return "Behavioral";
    default:
      return domain;
  }
};

// Calculate average score from domain scores
export const calculateAverageScore = (
  domainScores: CognitiveDomain
): number => {
  const scores = Object.values(domainScores);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
};

// Process sessions data for timeline visualization
export const processSessionsForTimeline = (
  sessions: SessionData[]
): Array<{ date: string; score: number }> => {
  return sessions
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    .map((session) => ({
      date: format(parseISO(session.startTime), "yyyy-MM-dd"),
      score: session.overallScore,
    }));
};

// Get appropriate recommendation based on metrics
export const generateRecommendations = (metrics: PatientMetrics): string[] => {
  const recommendations: string[] = [];

  if (metrics.attention < 60) {
    recommendations.push(
      "Focus on attention training exercises that gradually increase in duration"
    );
  }

  if (metrics.memory < 60) {
    recommendations.push(
      "Implement working memory activities in daily routines"
    );
  }

  if (metrics.executiveFunction < 60) {
    recommendations.push(
      "Practice planning and organizational skills through structured activities"
    );
  }

  if (metrics.behavioral < 60) {
    recommendations.push(
      "Consider behavioral management strategies to reduce impulsivity"
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Continue current intervention approach as progress is positive"
    );
  }

  return recommendations;
};
