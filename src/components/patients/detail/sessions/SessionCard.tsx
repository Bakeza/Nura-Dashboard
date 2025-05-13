
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TrendData } from '@/services/patient';
import { SessionTabProvider } from './SessionTabProvider';
import { getScoreColor, formatScore } from './utils/scoreUtils';

interface SessionCardProps {
  session: TrendData;
  idx: number;
  indexOfFirstSession: number;
  sessionsPerPage: number;
  totalPages: number;
  sortOrder: "desc" | "asc";
  selectedSessionIndex: number | null;
  expandedDomain: string | null;
  toggleSessionDetails: (index: number) => void;
  toggleDomainDetails: (domain: string) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  idx,
  indexOfFirstSession,
  sessionsPerPage,
  totalPages,
  sortOrder,
  selectedSessionIndex,
  expandedDomain,
  toggleSessionDetails,
  toggleDomainDetails
}) => {
  return (
    <div className="border rounded-md overflow-hidden shadow-sm transition-all hover:shadow-md">
      <div 
        className={`p-3 hover:bg-accent/30 transition-colors cursor-pointer ${selectedSessionIndex === idx ? 'bg-accent/50' : 'bg-card'}`}
        onClick={() => toggleSessionDetails(idx)}
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">
              {format(parseISO(session.session_date), "MMM d, yyyy")}
            </p>
            <p className="text-xs text-muted-foreground">
              Session {sortOrder === "desc" 
                ? totalPages * sessionsPerPage - indexOfFirstSession - idx 
                : indexOfFirstSession + idx + 1}
            </p>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              <div className="text-center">
                <span className="text-xs text-muted-foreground block">Attention</span>
                <p className={`text-sm font-medium ${getScoreColor(session.attention_score)}`}>
                  {formatScore(session.attention_score)}
                </p>
              </div>
              <div className="text-center">
                <span className="text-xs text-muted-foreground block">Memory</span>
                <p className={`text-sm font-medium ${getScoreColor(session.memory_score)}`}>
                  {formatScore(session.memory_score)}
                </p>
              </div>
              <div className="text-center">
                <span className="text-xs text-muted-foreground block">Impulse</span>
                <p className={`text-sm font-medium ${getScoreColor(session.impulse_score)}`}>
                  {formatScore(session.impulse_score)}
                </p>
              </div>
              <div className="text-center">
                <span className="text-xs text-muted-foreground block">Executive</span>
                <p className={`text-sm font-medium ${getScoreColor(session.executive_score)}`}>
                  {formatScore(session.executive_score)}
                </p>
              </div>
            </div>
            {selectedSessionIndex === idx ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
      </div>
      
      {selectedSessionIndex === idx && (
        <div className="px-3 pb-3 pt-0">
          <SessionTabProvider 
            session={session}
            expandedDomain={expandedDomain}
            toggleDomainDetails={toggleDomainDetails}
          />
        </div>
      )}
    </div>
  );
};
