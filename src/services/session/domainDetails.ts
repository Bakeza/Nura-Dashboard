
import axios from "axios";
import { API_BASE } from "../config";
// Import but don't use the mock details
// import { getMockDomainDetails } from "./mockDetails";

/**
 * Get domain-specific component details for a session
 */
export const getSessionDomainDetails = async (sessionId: string, domain: string) => {
  console.log(`Fetching ${domain} details for session ${sessionId}`);
  
  try {
    // Instead of using mock data, we'll use the API regardless of environment
    // and handle errors properly
    console.log(`Calling API: ${API_BASE}/api/cognitive/component-details/${sessionId}?domain=${domain}`);
    const response = await axios.get(`${API_BASE}/api/cognitive/component-details/${sessionId}?domain=${domain}`);
    console.log(`API returned ${domain} details:`, response.data);
    return response.data;
    
  } catch (error) {
    console.error(`Error fetching ${domain} details from API:`, error);
    // Return empty data structure instead of throwing error
    return {
      session_id: sessionId,
      overall_score: 0,
      percentile: 0,
      classification: "No Data Available",
      components: {},
      trendData: [],
      data_completeness: 0
    };
  }
};
