
import axios from "axios";
import { API_BASE } from "../config";

/**
 * Get all sessions for a specific user
 */
export const getUserSessions = (userId: string) => {
  console.log(`Fetching sessions for user ${userId}`);
  
  // Use the actual API endpoint
  return axios.get(`${API_BASE}/sessions/${userId}`)
    .then(response => {
      console.log("API returned sessions:", response.data);
      return response;
    })
    .catch(error => {
      console.error("Error fetching user sessions from API:", error);
      // Return empty data instead of mock data
      return Promise.resolve({ data: [] });
    });
};

/**
 * Get a specific session for a user
 */
export const getUserSession = (userId: string, sessionId: string) => {
  console.log(`Fetching specific session ${sessionId} for user ${userId}`);
  
  // Use the actual API endpoint
  return axios.get(`${API_BASE}/sessions/${userId}/${sessionId}`)
    .then(response => {
      console.log("API returned specific session:", response.data);
      return response;
    })
    .catch(error => {
      console.error(`Error fetching session ${sessionId} from API:`, error);
      // Return empty data instead of mock data
      return Promise.resolve({ data: {} });
    });
};
