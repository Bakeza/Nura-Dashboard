
import { useState, useMemo, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { TrendData } from '@/services/patient';

export interface SessionFiltersState {
  searchQuery: string;
  scoreFilter: string;
  dateRangeFilter: string;
  sortOrder: "desc" | "asc";
  currentPage: number;
}

export interface SessionFiltersActions {
  setSearchQuery: (query: string) => void;
  setScoreFilter: (filter: string) => void;
  setDateRangeFilter: (filter: string) => void;
  toggleSortOrder: () => void;
  changePage: (page: number) => void;
  clearFilters: () => void;
}

export interface UseSessionFiltersResult {
  state: SessionFiltersState;
  actions: SessionFiltersActions;
  filteredSessions: TrendData[];
  currentSessions: TrendData[];
  totalPages: number;
  indexOfFirstSession: number;
}

export function useSessionFilters(
  trendGraph: TrendData[],
  sessionsPerPage: number = 3
): UseSessionFiltersResult {
  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [scoreFilter, setScoreFilter] = useState<string>("all");
  const [dateRangeFilter, setDateRangeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // First, sort the sessions by date
  const sortedSessions = useMemo(() => {
    if (!trendGraph?.length) return [];
    
    return [...trendGraph].sort((a, b) => {
      const dateA = new Date(a.session_date).getTime();
      const dateB = new Date(b.session_date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [trendGraph, sortOrder]);
  
  // Apply filters (search and score)
  const filteredSessions = useMemo(() => {
    if (!sortedSessions?.length) return [];
    
    let filtered = [...sortedSessions];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => {
        const date = format(parseISO(session.session_date), "MMM d, yyyy").toLowerCase();
        return date.includes(query);
      });
    }
    
    // Apply score filter
    if (scoreFilter !== "all") {
      const minScore = parseInt(scoreFilter);
      filtered = filtered.filter(session => {
        // Filter based on average of all scores
        const avgScore = (session.memory_score + session.attention_score + 
                        session.impulse_score + session.executive_score) / 4;
        return avgScore >= minScore;
      });
    }
    
    // Apply date range filter
    if (dateRangeFilter !== "all") {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (dateRangeFilter) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(session => {
        const sessionDate = new Date(session.session_date);
        return sessionDate >= cutoffDate;
      });
    }
    
    return filtered;
  }, [sortedSessions, searchQuery, scoreFilter, dateRangeFilter]);
  
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, scoreFilter, dateRangeFilter, sortOrder]);
  
  // Get current sessions for pagination
  const totalPages = Math.ceil((filteredSessions?.length || 0) / sessionsPerPage);
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions?.slice(indexOfFirstSession, indexOfLastSession) || [];
  
  // Handle pagination
  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setScoreFilter("all");
    setDateRangeFilter("all");
  };

  return {
    state: {
      searchQuery,
      scoreFilter,
      dateRangeFilter,
      sortOrder,
      currentPage
    },
    actions: {
      setSearchQuery,
      setScoreFilter,
      setDateRangeFilter,
      toggleSortOrder,
      changePage,
      clearFilters
    },
    filteredSessions,
    currentSessions,
    totalPages,
    indexOfFirstSession
  };
}
