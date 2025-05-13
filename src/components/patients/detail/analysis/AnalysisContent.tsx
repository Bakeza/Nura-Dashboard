
import React from 'react';
import { DomainComparison } from '@/components/analysis/DomainComparison';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';
import { CognitiveDomain } from '@/components/analysis/CognitiveDomain';
import { CognitiveDomainGrid } from './CognitiveDomainGrid';
import { CognitiveDomainMetrics } from '@/utils/types/patientTypes';
import { AnalysisLoading } from './AnalysisLoading';

interface AnalysisContentProps {
  patientMetrics: CognitiveDomainMetrics | null;
  normativeData: CognitiveDomainMetrics;
  subtypeData: CognitiveDomainMetrics;
  performanceTrendData: Array<{date: string; score: number;}>;
  domainTrendData: Record<string, any>;
  isLoadingDomainData: boolean;
}

export const AnalysisContent: React.FC<AnalysisContentProps> = ({
  patientMetrics,
  normativeData,
  subtypeData,
  performanceTrendData,
  domainTrendData,
  isLoadingDomainData
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid gap-6 md:grid-cols-2">
        {patientMetrics && (
          <DomainComparison 
            patientData={patientMetrics}
            normativeData={normativeData}
            subtypeData={subtypeData}
          />
        )}
        <PerformanceTrend 
          data={performanceTrendData}
          title="Overall Performance Trend"
          description="Progress tracking across all cognitive metrics"
        />
      </div>
      
      <CognitiveDomainGrid 
        patientMetrics={patientMetrics}
        domainTrendData={domainTrendData}
        isLoadingDomainData={isLoadingDomainData}
      />
    </div>
  );
};
