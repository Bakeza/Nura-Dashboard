
/*
// This file serves as the entry point for mock data
// It initializes and exports all generated mock data

import { 
  Patient, 
  PatientMetrics, 
  SessionData, 
  CognitiveDomain,
  ReportType,
  CognitiveDomainMetrics 
} from './types/patientTypes';
import { generatePatients, generatePatientMetrics } from './generators/patientGenerators';
import { generateSessionData } from './generators/sessionGenerators';
import { generateTrendData, generatePercentileData } from './generators/trendGenerators';
import { generateRecommendations } from './generators/recommendationGenerators';
import { 
  mockPatientData, 
  mockNormativeData, 
  mockSubtypeData,
  mockTrendData,
  mockImprovementData,
  mockPercentileData,
  generateSessionPerformance
} from './mockData/cognitiveDomainData';
import { generateReports, mockReports } from './mockData/reportData';

// Initialize mock data
export const patients = generatePatients(12);
export const patientMetrics = generatePatientMetrics(patients);
export const sessionData = generateSessionData(patients);
export const reports = generateReports(patients.map(p => p.id));

// Export mock cognitive domain data
export { 
  mockPatientData, 
  mockNormativeData, 
  mockSubtypeData,
  mockTrendData,
  mockImprovementData,
  mockPercentileData,
  generateSessionPerformance
};

// For convenience, create a map of patient IDs to their metrics
export const metricsMap = patientMetrics.reduce((acc, metrics) => {
  acc[metrics.patientId] = metrics;
  return acc;
}, {} as Record<string, PatientMetrics>);

// For convenience, create a map of patient IDs to their sessions
export const sessionsMap = sessionData.reduce((acc, session) => {
  if (!acc[session.patientId]) {
    acc[session.patientId] = [];
  }
  acc[session.patientId].push(session);
  return acc;
}, {} as Record<string, SessionData[]>);

// For convenience, create a map of patient IDs to their reports
export const reportsMap = reports.reduce((acc, report) => {
  if (!acc[report.patientId]) {
    acc[report.patientId] = [];
  }
  acc[report.patientId].push(report);
  return acc;
}, {} as Record<string, ReportType[]>);

// Re-export all types and generator functions
export type { Patient, PatientMetrics, SessionData, CognitiveDomain, ReportType, CognitiveDomainMetrics };
export { 
  generatePatients, 
  generatePatientMetrics, 
  generateSessionData, 
  generateTrendData, 
  generatePercentileData,
  generateRecommendations,
  mockReports
};*/

// Import only the types we need
import { 
  Patient, 
  PatientMetrics, 
  SessionData, 
  CognitiveDomain,
  ReportType,
  CognitiveDomainMetrics 
} from './types/patientTypes';

// Empty mock data for the application to use instead of actual mock values
export const patients: Patient[] = [];
export const patientMetrics: PatientMetrics[] = [];
export const sessionData: SessionData[] = [];
export const reports: ReportType[] = [];

// Empty cognitive domain data
export const mockPatientData = {};
export const mockNormativeData = {};
export const mockSubtypeData = {};
export const mockTrendData = [];
export const mockImprovementData = {};
export const mockPercentileData = {};
export const generateSessionPerformance = () => ({});

// Empty maps
export const metricsMap = {} as Record<string, PatientMetrics>;
export const sessionsMap = {} as Record<string, SessionData[]>;
export const reportsMap = {} as Record<string, ReportType[]>;

// Export the types and empty generator functions 
export type { Patient, PatientMetrics, SessionData, CognitiveDomain, ReportType, CognitiveDomainMetrics };
export const generatePatients = () => [];
export const generatePatientMetrics = () => [];
export const generateSessionData = () => [];
export const generateTrendData = () => [];
export const generatePercentileData = () => ({
  patient: {},
  ageGroup: {},
  adhdSubtype: {}
});
export const generateRecommendations = () => [''];
export const mockReports = () => [];
