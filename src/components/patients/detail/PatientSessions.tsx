
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TrendData } from '@/services/patient';
import { SessionFilters } from './sessions/SessionFilters';
import { SessionCard } from './sessions/SessionCard';
import { SessionPagination } from './sessions/SessionPagination';
import { NoSessionsData } from './sessions/NoSessionsData';
import { NoResultsMessage } from './sessions/NoResultsMessage';
import { useSessionFilters } from './sessions/hooks/useSessionFilters';

interface PatientSessionsProps {
  trendGraph: TrendData[];
  hasTrendData: boolean;
}

export const PatientSessions: React.FC<PatientSessionsProps> = ({ trendGraph, hasTrendData }) => {
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number | null>(null);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const sessionsPerPage = 3;
  const {
    state: { searchQuery, scoreFilter, dateRangeFilter, sortOrder, currentPage },
    actions: { setSearchQuery, setScoreFilter, setDateRangeFilter, toggleSortOrder, changePage, clearFilters },
    filteredSessions,
    currentSessions,
    totalPages,
    indexOfFirstSession
  } = useSessionFilters(trendGraph, sessionsPerPage);

  const toggleSessionDetails = (index: number) => {
    if (selectedSessionIndex === index) {
      setSelectedSessionIndex(null);
    } else {
      setSelectedSessionIndex(index);
      setExpandedDomain(null);
    }
  };

  const toggleDomainDetails = (domain: string) => {
    if (expandedDomain === domain) {
      setExpandedDomain(null);
    } else {
      setExpandedDomain(domain);
    }
  };

  return (
    <Card className="glass shadow-md border-0">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Session Details</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleSortOrder}
              className="flex items-center gap-1 text-xs"
            >
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              {sortOrder === "desc" ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {!hasTrendData ? (
          <NoSessionsData />
        ) : (
          <div className="space-y-4">
            {/* Search and filters */}
            <SessionFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              scoreFilter={scoreFilter}
              setScoreFilter={setScoreFilter}
              dateRangeFilter={dateRangeFilter}
              setDateRangeFilter={setDateRangeFilter}
            />
            
            {/* No results message */}
            {filteredSessions.length === 0 && (
              <NoResultsMessage onClearFilters={clearFilters} />
            )}
            
            {/* Session cards */}
            {currentSessions.map((session, idx) => (
              <SessionCard 
                key={idx}
                session={session}
                idx={idx}
                indexOfFirstSession={indexOfFirstSession}
                sessionsPerPage={sessionsPerPage}
                totalPages={totalPages}
                sortOrder={sortOrder}
                selectedSessionIndex={selectedSessionIndex}
                expandedDomain={expandedDomain}
                toggleSessionDetails={toggleSessionDetails}
                toggleDomainDetails={toggleDomainDetails}
              />
            ))}
            
            {/* Pagination */}
            <SessionPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              changePage={changePage}
            />
            
            {/* Show empty state if filtered has results but current page has none */}
            {filteredSessions.length > 0 && currentSessions.length === 0 && (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No sessions on this page.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
