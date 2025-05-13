
import React from 'react';
import { CognitiveDomain } from '@/components/analysis/CognitiveDomain';
import { CognitiveDomainMetrics } from '@/utils/types/patientTypes';
import { AnalysisLoading } from './AnalysisLoading';
import { PerformanceTrend } from '@/components/analysis/PerformanceTrend';
import { InfoTooltip } from '@/components/ui/info-tooltip';

interface CognitiveDomainGridProps {
  patientMetrics: CognitiveDomainMetrics | null;
  domainTrendData: Record<string, any>;
  isLoadingDomainData: boolean;
}

export const CognitiveDomainGrid: React.FC<CognitiveDomainGridProps> = ({
  patientMetrics,
  domainTrendData,
  isLoadingDomainData
}) => {
  if (isLoadingDomainData) {
    return <AnalysisLoading />;
  }
  
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-1 mb-2">
            <h3 className="text-lg font-medium">Attention Domain</h3>
            <InfoTooltip text="Ability to focus and concentrate on specific stimuli while filtering out distractions" />
          </div>
          <PerformanceTrend 
            data={domainTrendData.attention || []}
            title="Attention Domain"
            description="Focus and sustained attention"
            showDuration={true}
          />
        </div>
        <div>
          <div className="flex items-center gap-1 mb-2">
            <h3 className="text-lg font-medium">Memory Domain</h3>
            <InfoTooltip text="Ability to encode, store and retrieve information both short and long term" />
          </div>
          <PerformanceTrend 
            data={domainTrendData.memory || []}
            title="Memory Domain"
            description="Working and visual memory tasks"
            showDuration={true}
          />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-1 mb-2">
            <h3 className="text-lg font-medium">Executive Function Domain</h3>
            <InfoTooltip text="Higher-order cognitive processes including planning, working memory, cognitive flexibility, and inhibitory control" />
          </div>
          <PerformanceTrend 
            data={domainTrendData.executiveFunction || []}
            title="Executive Function Domain"
            description="Planning and cognitive flexibility"
            showDuration={true}
          />
        </div>
        <div>
          <div className="flex items-center gap-1 mb-2">
            <h3 className="text-lg font-medium">Impulse Control Domain</h3>
            <InfoTooltip text="Ability to resist impulsive behaviors, control impulses, and regulate responses to stimuli" />
          </div>
          <PerformanceTrend 
            data={domainTrendData.behavioral || []}
            title="Impulse Control Domain"
            description="Response inhibition and control"
            showDuration={true}
          />
        </div>
      </div>
    </>
  );
};
