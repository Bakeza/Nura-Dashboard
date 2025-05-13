
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PatientProfile } from './PatientProfile';
import { PatientSessions } from './PatientSessions';
import { PatientAnalysis } from './PatientAnalysis';
import { PatientReportTab } from './PatientReportTab';
import { TrendData } from '@/services/patient';

interface PatientDetailTabsProps {
  patientId: string;
  patientName: string;
  patientAgeGroup: string;
  patientAdhdSubtype: string | null;
  avgDomainScores: {
    memory: number;
    attention: number;
    impulse_control: number;
    executive_function: number;
  };
  trendGraph: TrendData[];
  totalSessions: number;
  firstSessionDate: string | null;
  lastSessionDate: string | null;
  age: number;
  gender: string;
  defaultTab?: string;
}

export const PatientDetailTabs: React.FC<PatientDetailTabsProps> = ({
  patientId,
  patientName,
  patientAgeGroup,
  patientAdhdSubtype,
  avgDomainScores,
  trendGraph,
  totalSessions,
  firstSessionDate,
  lastSessionDate,
  age,
  gender,
  defaultTab = 'profile'
}) => {
  const hasTrendData = trendGraph && trendGraph.length > 0;

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="analysis">Analysis</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <PatientProfile 
          patientAgeGroup={patientAgeGroup}
          patientAdhdSubtype={patientAdhdSubtype}
          avgDomainScores={avgDomainScores}
          trendGraph={trendGraph}
          totalSessions={totalSessions}
          firstSessionDate={firstSessionDate}
          lastSessionDate={lastSessionDate}
          age={age}
          gender={gender}
          hasTrendData={hasTrendData}
        />
      </TabsContent>

      <TabsContent value="sessions">
        <PatientSessions 
          trendGraph={trendGraph}
          hasTrendData={hasTrendData}
        />
      </TabsContent>

      <TabsContent value="analysis">
        <PatientAnalysis 
          trendGraph={trendGraph}
          hasTrendData={hasTrendData}
        />
      </TabsContent>

      <TabsContent value="reports">
        <PatientReportTab 
          patientId={patientId}
          patientName={patientName}
        />
      </TabsContent>
    </Tabs>
  );
};
