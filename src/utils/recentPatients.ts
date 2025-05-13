/**
 * Utility functions to manage recently clicked patients
 */

const STORAGE_KEY = 'nura_recent_patients';
const MAX_RECENT_PATIENTS = 8;

interface RecentPatient {
  user_id: string;
  name: string;
  timestamp: number;
  age?: number;
  gender?: string;
  adhd_subtype?: string;
  last_session_date?: string;
  total_sessions?: number;
}

/**
 * Add a patient to the recently viewed list
 */
export const addRecentPatient = (patient: Omit<RecentPatient, 'timestamp'>): void => {
  try {
    const existingData = getRecentPatients();
    
    // Remove if already exists to avoid duplicates
    const filtered = existingData.filter(p => p.user_id !== patient.user_id);
    
    // Add new entry with timestamp
    const updatedData = [
      { ...patient, timestamp: Date.now() },
      ...filtered,
    ].slice(0, MAX_RECENT_PATIENTS); // Keep only the most recent N patients
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Failed to save recent patient:', error);
  }
};

/**
 * Get list of recently viewed patients
 */
export const getRecentPatients = (): RecentPatient[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get recent patients:', error);
    return [];
  }
};
