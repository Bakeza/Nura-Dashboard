
import { TrendData } from "@/services/patient";
import SessionService from "@/services/session";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface ExecutiveTabProps {
  session: TrendData;
  expandedDomain: string | null;
  toggleDomainDetails: (domain: string) => void;
  getScoreColor: (score: number) => string;
  formatScore: (score: number) => number;
  formatPercentile: (percentile: number) => string;
  getClassificationStyle: (classification: string) => string;
}

export const ExecutiveTab: React.FC<ExecutiveTabProps> = ({
  session,
  expandedDomain,
  toggleDomainDetails,
  getScoreColor,
  formatScore,
  formatPercentile,
  getClassificationStyle,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executiveDetails, setExecutiveDetails] = useState<any>(null);

  // Get the session ID directly from the session_id property
  const sessionId = session.session_id;

  useEffect(() => {
    // Only fetch when executive domain is expanded and we don't already have the data
    if (expandedDomain === "executive" && sessionId && !executiveDetails) {
      setLoading(true);
      setError(null);

      SessionService.getSessionDomainDetails(sessionId, "executive_function")
        .then((data) => {
          setExecutiveDetails(data);
          console.log("Fetched executive function details:", data);
        })
        .catch((err) => {
          console.error("Error fetching executive function details:", err);
          setError("Failed to load executive function details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [expandedDomain, sessionId, executiveDetails]);

  // Fallback to session data if API fetch fails or isn't expanded yet
  const details = executiveDetails || session.executive_details;

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading executive function details...</p>
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
        <p>No detailed executive function data available for this session</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-3 gap-3 bg-muted/40 p-3 rounded-md">
        <div className="text-center p-2 bg-background rounded shadow-sm">
          <div className="text-xs text-muted-foreground">Overall Score</div>
          <div
            className={`text-xl font-bold ${getScoreColor(
              details.overall_score
            )}`}
          >
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
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationStyle(
              details.classification
            )}`}
          >
            {details.classification}
          </span>
        </div>
      </div>

      <div>
        <div className="font-medium mb-3 text-sm flex items-center gap-1">
          <span>Domain Contributions</span>
          <InfoTooltip 
            text="Individual components of executive function that contribute to the overall score" 
            size="sm" 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(details.components || {}).map(([key, value]) => (
            <div
              key={key}
              className="border rounded-md p-3 bg-background shadow-sm"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-1">
                  <span className="font-medium capitalize">
                    {key.replace(/_contribution/g, "").replace(/_/g, " ")}
                  </span>
                  <InfoTooltip 
                    text={getComponentDescription(key.replace(/_contribution/g, ""))}
                    size="sm"
                  />
                </div>
                <span
                  className={`font-bold ${getScoreColor(
                    typeof value === "number" ? value : 0
                  )}`}
                >
                  {typeof value === "number"
                    ? formatScore(value)
                    : String(value)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {details.profile_pattern && (
        <div>
          <div className="text-sm font-medium mb-2 flex items-center gap-1">
            <span>Profile Pattern</span>
            <InfoTooltip 
              text="A characteristic pattern of strengths and weaknesses across executive function abilities"
              size="sm"
            />
          </div>
          <div className="bg-muted/20 p-3 rounded-md">
            <p className="text-sm">{details.profile_pattern}</p>
          </div>
        </div>
      )}

      {typeof details.data_completeness !== "undefined" && (
        <div>
          <div className="text-sm font-medium mb-2 flex items-center gap-1">
            <span>Data Completeness</span>
            <InfoTooltip 
              text="Percentage of expected data points that were successfully collected"
              size="sm"
            />
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{
                width: `${
                  typeof details.data_completeness === "number"
                    ? details.data_completeness * 100
                    : details.data_completeness
                }%`,
              }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {typeof details.data_completeness === "number"
              ? `${Math.round(details.data_completeness * 100)}% complete`
              : `${details.data_completeness}% complete`}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to provide descriptions for different executive function components
function getComponentDescription(component: string): string {
  const descriptions: Record<string, string> = {
    "working memory": "Ability to hold information in mind and mentally work with it",
    "planning": "Ability to identify steps needed to reach a goal and organize actions accordingly",
    "cognitive flexibility": "Ability to switch thinking between concepts or adapt behavior to new situations",
    "inhibition": "Ability to control impulses and resist distractions",
    "organization": "Ability to arrange information and materials in a systematic way",
    "task monitoring": "Ability to evaluate performance during or after task completion",
    "emotional control": "Ability to manage emotional responses appropriately",
    "self regulation": "Ability to monitor and control one's own behavior and emotional reactions",
    "initiation": "Ability to begin an activity and independently generate ideas",
  };

  return descriptions[component.toLowerCase()] || 
    "A component of executive functioning that contributes to overall cognitive control and management";
}
