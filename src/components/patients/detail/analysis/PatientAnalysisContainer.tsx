
import React from 'react';
import { TrendData } from '@/services/patient';
import { NoAnalysisData } from './NoAnalysisData';
import { AnalysisError } from './AnalysisError';
import { AnalysisLoading } from './AnalysisLoading';
import { AnalysisContent } from './AnalysisContent';

interface PatientAnalysisProps {
  trendGraph: TrendData[];
  hasTrendData: boolean;
}

export const PatientAnalysis: React.FC<PatientAnalysisProps> = ({ trendGraph, hasTrendData }) => {
  const [isLoadingDomainData, setIsLoadingDomainData] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  
  // Prepare data for components
  const createMetricsData = () => {
    if (!hasTrendData || trendGraph.length === 0) return null;
    
    const latestSession = trendGraph[trendGraph.length - 1];
    return {
      attention: latestSession.attention_score,
      memory: latestSession.memory_score,
      executiveFunction: latestSession.executive_score,
      behavioral: latestSession.impulse_score
    };
  };
  
  // Create percentile comparison data
  const percentileData = {
    ageGroup: {
      attention: 75,
      memory: 68,
      executiveFunction: 72,
      behavioral: 70
    },
    adhdSubtype: {
      attention: 60,
      memory: 55,
      executiveFunction: 58,
      behavioral: 52
    }
  };

  // Create performance trend data with validation
  const createPerformanceTrendData = () => {
    if (!hasTrendData || trendGraph.length === 0) return [];
    
    return trendGraph.map(session => ({
      date: session.session_date,
      score: (session.attention_score + session.memory_score + 
              session.executive_score + session.impulse_score) / 4
    }));
  };

  // Create domain trend data directly from trend graph
  const createDomainTrendData = () => {
    if (!hasTrendData || trendGraph.length === 0) return {
      attention: [],
      memory: [],
      executiveFunction: [],
      behavioral: []
    };

    return {
      attention: trendGraph.map(session => ({
        date: session.session_date,
        score: session.attention_score,
        duration: session.attention_details?.components?.sequence_score
      })),
      memory: trendGraph.map(session => ({
        date: session.session_date,
        score: session.memory_score,
        duration: session.memory_details?.components?.working_memory?.score
      })),
      executiveFunction: trendGraph.map(session => ({
        date: session.session_date,
        score: session.executive_score,
        duration: session.executive_details?.components?.memory_contribution
      })),
      behavioral: trendGraph.map(session => ({
        date: session.session_date,
        score: session.impulse_score,
        duration: session.impulse_details?.components?.inhibitory_control
      }))
    };
  };
  
  const patientMetrics = createMetricsData();
  const performanceTrendData = createPerformanceTrendData();
  const domainTrendData = createDomainTrendData();

  if (!hasTrendData) {
    return <NoAnalysisData />;
  }

  if (fetchError) {
    return <AnalysisError errorMessage={fetchError} />;
  }

  return (
    <AnalysisContent 
      patientMetrics={patientMetrics}
      normativeData={percentileData.ageGroup}
      subtypeData={percentileData.adhdSubtype}
      performanceTrendData={performanceTrendData}
      domainTrendData={domainTrendData}
      isLoadingDomainData={isLoadingDomainData}
    />
  );
};
