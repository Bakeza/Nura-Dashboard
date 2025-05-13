
// Type definitions for patient and assessment data

export interface Patient {
  id?: string; // Keep for backward compatibility
  user_id: string; // Add this field to match the PatientList component's expectation
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  diagnosisDate?: string;
  adhdSubtype?: 'Inattentive' | 'Hyperactive-Impulsive' | 'Combined' | null;
  assessmentCount?: number;
  lastAssessment?: string | null;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  phone_number?: string;
  email?: string;
  username?: string;
}

export interface CognitiveDomain {
  attention: number;
  memory: number;
  executiveFunction: number;
  behavioral: number;
}

export interface CognitiveDomainMetrics extends CognitiveDomain {
  [key: string]: number;
}

export interface PatientMetrics extends CognitiveDomain {
  patientId: string;
  date: string;
  percentile: number;
  sessionsDuration: number;
  sessionsCompleted: number;
  progress: number;
  clinicalConcerns: string[];
  [key: string]: string | number | string[];
}

export interface SessionData {
  id: string;
  patientId: string;
  startTime: string;
  endTime: string;
  duration: number;
  environment: 'Home' | 'School' | 'Clinic';
  completionStatus: 'Completed' | 'Abandoned' | 'Interrupted';
  overallScore: number;
  device: string;
  activities: Array<{
    id: string;
    type: string;
    score: number;
    duration: number;
    difficulty: number;
  }>;
  domainScores: CognitiveDomain;
}

export interface ReportSummary {
  attention?: string;
  memory?: string;
  executiveFunction?: string;
  behavioral?: string;
  overall?: string;
}

export interface ReportRecommendation {
  title: string;
  description: string;
}

export interface ReportData {
  date: string;
  metrics: PatientMetrics;
  summary?: ReportSummary;
  recommendations?: ReportRecommendation[];
}

export interface ReportType {
  id: string;
  patientId: string;
  title: string;
  type: 'clinical' | 'school' | 'progress' | 'detailed' | 'comprehensive';
  createdDate: string;
  sections: {
    overview: boolean;
    domainAnalysis: boolean;
    trends: boolean;
    recommendations: boolean;
    rawData: boolean;
  };
  status: 'draft' | 'generated' | 'shared';
  data?: ReportData;
}

export interface PatientData {
  patient: Patient;
  metrics: PatientMetrics;
  sessions: SessionData[];
  reports: ReportType[];
}
