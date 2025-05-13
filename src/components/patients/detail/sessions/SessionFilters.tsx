
import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SessionFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  scoreFilter: string;
  setScoreFilter: (value: string) => void;
  dateRangeFilter: string;
  setDateRangeFilter: (value: string) => void;
}

export const SessionFilters: React.FC<SessionFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  scoreFilter,
  setScoreFilter,
  dateRangeFilter,
  setDateRangeFilter
}) => {
  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
        <Input 
          type="search"
          placeholder="Search sessions..." 
          className="pl-8 sm:pl-9 h-9 sm:h-10 text-xs sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Select value={scoreFilter} onValueChange={setScoreFilter}>
        <SelectTrigger className="w-full h-9 sm:h-10 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" /> 
            <SelectValue placeholder="Filter by score" className="text-xs sm:text-sm" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-xs sm:text-sm">
          <SelectItem value="all">All scores</SelectItem>
          <SelectItem value="80">Excellent (80+)</SelectItem>
          <SelectItem value="60">Good (60+)</SelectItem>
          <SelectItem value="40">Average (40+)</SelectItem>
          <SelectItem value="0">All scores</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
        <SelectTrigger className="w-full h-9 sm:h-10 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <SelectValue placeholder="Filter by date" className="text-xs sm:text-sm" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-xs sm:text-sm">
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="week">Past week</SelectItem>
          <SelectItem value="month">Past month</SelectItem>
          <SelectItem value="quarter">Past 3 months</SelectItem>
          <SelectItem value="year">Past year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
