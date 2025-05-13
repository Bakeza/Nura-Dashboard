
/*
import { ReportType } from '../types/patientTypes';
import { v4 as uuidv4 } from 'uuid';
import { randomChoice } from '../helpers/randomUtils';
import { subDays, format } from 'date-fns';

/**
 * Generate mock report data for patients
 */
/*export const generateReports = (patientIds: string[]): ReportType[] => {
  const reports: ReportType[] = [];
  
  patientIds.forEach(patientId => {
    // Generate between 0-5 reports per patient
    const numReports = Math.floor(Math.random() * 6);
    
    for (let i = 0; i < numReports; i++) {
      const reportType = randomChoice(['clinical', 'school', 'progress', 'detailed']) as ReportType['type'];
      const reportStatus = randomChoice(['draft', 'generated', 'shared']) as ReportType['status'];
      const daysAgo = Math.floor(Math.random() * 60); // Report created in the last 60 days
      
      reports.push({
        id: uuidv4(),
        patientId,
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
        type: reportType,
        createdDate: format(subDays(new Date(), daysAgo), 'yyyy-MM-dd'),
        sections: {
          overview: true,
          domainAnalysis: Math.random() > 0.2, // 80% chance to be included
          trends: Math.random() > 0.3, // 70% chance to be included
          recommendations: Math.random() > 0.1, // 90% chance to be included
          rawData: Math.random() > 0.7, // 30% chance to be included
        },
        status: reportStatus
      });
    }
  });
  
  return reports;
};

export const mockReports = (patientId: string): ReportType[] => {
  return [
    {
      id: uuidv4(),
      patientId,
      title: "Clinical Report",
      type: "clinical",
      createdDate: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      sections: {
        overview: true,
        domainAnalysis: true,
        trends: true,
        recommendations: true,
        rawData: false
      },
      status: "generated"
    },
    {
      id: uuidv4(),
      patientId,
      title: "School Accommodation",
      type: "school",
      createdDate: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
      sections: {
        overview: true,
        domainAnalysis: true,
        trends: false,
        recommendations: true,
        rawData: false
      },
      status: "shared"
    },
    {
      id: uuidv4(),
      patientId,
      title: "Progress Summary",
      type: "progress",
      createdDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
      sections: {
        overview: true,
        domainAnalysis: false,
        trends: true,
        recommendations: false,
        rawData: false
      },
      status: "shared"
    }
  ];
};*/

// Empty implementations to avoid import errors
import { v4 as uuidv4 } from 'uuid';
export const generateReports = () => [];
export const mockReports = () => [];
