import { TrendData } from "@/services/patient";
import SessionService from "@/services/session";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ImpulseTabProps {
  session: TrendData;
  expandedDomain: string | null;
  toggleDomainDetails: (domain: string) => void;
  getScoreColor: (score: number) => string;
  formatScore: (score: number) => number;
  formatPercentile: (percentile: number) => string;
  getClassificationStyle: (classification: string) => string;
}

export const ImpulseTab: React.FC<ImpulseTabProps> = ({
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
  const [impulseDetails, setImpulseDetails] = useState<any>(null);

  // Get the session ID directly from the session_id property
  const sessionId = session.session_id;

  useEffect(() => {
    // Only fetch when impulse domain is expanded and we don't already have the data
    if (expandedDomain === "impulse" && sessionId && !impulseDetails) {
      setLoading(true);
      setError(null);

      console.log(
        "ImpulseTab - Fetching impulse details for session ID:",
        sessionId
      );

      SessionService.getSessionDomainDetails(sessionId, "impulse_control")
        .then((data) => {
          console.log("ImpulseTab - Fetched impulse details:", data);
          setImpulseDetails(data);
        })
        .catch((err) => {
          console.error("Error fetching impulse details:", err);
          setError("Failed to load impulse control details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [expandedDomain, sessionId, impulseDetails]);

  // Fallback to session data if API fetch fails or isn't expanded yet
  const details = impulseDetails || session?.impulse_details;

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Loading impulse control details...</p>
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
        <p>No detailed impulse control data available for this session</p>
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
        <div className="font-medium mb-3 text-sm">Components</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.components &&
            Object.entries(details.components || {}).map(([key, value]) => (
              <div
                key={key}
                className="border rounded-md p-3 bg-background shadow-sm"
              >
                <div className="flex justify-between">
                  <span className="font-medium capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-medium mb-2">Games Used</div>
          <div className="flex flex-wrap gap-2">
            {details.games_used?.map((game, i) => (
              <span
                key={i}
                className="bg-primary/10 px-2 py-1 rounded-full text-xs font-medium text-primary"
              >
                {game}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Data Completeness</div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{
                width: `${
                  typeof details.data_completeness === "number"
                    ? details.data_completeness * 100
                    : details.data_completeness * 100
                }%`,
              }}
            ></div>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {typeof details.data_completeness === "number"
              ? `${Math.round(details.data_completeness * 100)}% complete`
              : `${Math.round(details.data_completeness * 100)}% complete`}
          </div>
        </div>
      </div>
    </div>
  );
};
