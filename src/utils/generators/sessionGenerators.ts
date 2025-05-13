
/*
import { format, subDays, addMinutes } from 'date-fns';
import { Patient, SessionData } from '../types/patientTypes';
import { randomInt, randomFloat, randomChoice } from '../helpers/randomUtils';

/**
 * Generate session data for patients
 */
/*export const generateSessionData = (patients: Patient[], sessionsPerPatient: number = 5): SessionData[] => {
  const environments: Array<'Home' | 'School' | 'Clinic'> = ['Home', 'School', 'Clinic'];
  const completionStatuses: Array<'Completed' | 'Abandoned' | 'Interrupted'> = ['Completed', 'Abandoned', 'Interrupted'];
  const devices = ['iPad Pro', 'iPhone 13', 'Android Tablet', 'Samsung Galaxy S21', 'Desktop Computer', 'Laptop'];
  const activityTypes = ['Attention Farming', 'Memory Sequence', 'Card Matching', 'Response Inhibition', 'Task Switching'];
  
  let sessions: SessionData[] = [];
  
  patients.forEach(patient => {
    for (let i = 0; i < sessionsPerPatient; i++) {
      const date = subDays(new Date(), randomInt(1, 90));
      const startTime = format(date, "yyyy-MM-dd'T'HH:mm:ss");
      const durationMinutes = randomInt(15, 45);
      const endTime = format(addMinutes(date, durationMinutes), "yyyy-MM-dd'T'HH:mm:ss");
      
      const activityCount = randomInt(3, 6);
      const activities = Array.from({ length: activityCount }, (_, actIdx) => ({
        id: `ACT${patient.id}-${i}-${actIdx}`,
        type: randomChoice(activityTypes),
        score: randomFloat(50, 98),
        duration: randomInt(2, 10) * 60, // in seconds
        difficulty: randomInt(1, 5)
      }));
      
      const attention = randomFloat(40, 95);
      const memory = randomFloat(40, 95);
      const executiveFunction = randomFloat(40, 95);
      const behavioral = randomFloat(40, 95);
      
      sessions.push({
        id: `S${patient.id}-${i}`,
        patientId: patient.id,
        startTime,
        endTime,
        duration: durationMinutes * 60, // in seconds
        environment: randomChoice(environments),
        completionStatus: randomChoice(completionStatuses),
        overallScore: randomFloat(50, 98),
        device: randomChoice(devices),
        activities,
        domainScores: {
          attention,
          memory,
          executiveFunction,
          behavioral
        }
      });
    }
  });
  
  return sessions;
};*/

// Empty implementation to avoid import errors
export const generateSessionData = () => [];
