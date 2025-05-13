import axios, { AxiosError, AxiosResponse } from "axios";
import { API_BASE } from "./config"; // Make sure this points to your backend URL

// Define the structure for the patient profile data based on the API
export interface DomainScores {
  memory: number;
  attention: number;
  impulse_control: number;
  executive_function: number;
}

interface WorkingMemoryComponent {
  score: number;
  components: Record<string, number | string>;
}

interface VisualMemoryComponent {
  score: number;
  components: Record<string, number | string>;
}

interface MemoryDetails {
  overall_score: number;
  percentile: number;
  classification: string;
  components: {
    working_memory: WorkingMemoryComponent;
    visual_memory: VisualMemoryComponent;
  };
  data_completeness: number;
  tasks_used: string[];
}

interface ImpulseDetails {
  overall_score: number;
  percentile: number;
  classification: string;
  components: {
    inhibitory_control: number;
    response_control: number;
    decision_speed: number;
    error_adaptation: number;
  };
  data_completeness: number;
  games_used: string[];
}

interface AttentionDetails {
  overall_score: number;
  percentile: number;
  classification: string;
  components: {
    crop_score: number;
    sequence_score: number;
  };
  data_completeness: number;
  tasks_used?: string[];
}

interface ExecutiveDetails {
  overall_score: number;
  percentile: number;
  classification: string;
  components: {
    memory_contribution: number;
    impulse_contribution: number;
    attention_contribution: number;
  };
  profile_pattern: string;
  data_completeness: number;
}

export interface TrendData {
  id?: string; // Keep for backward compatibility
  session_id: string; // Add this field to match the actual data structure
  session_date: string;
  attention_score: number;
  memory_score: number;
  impulse_score: number;
  executive_score: number;
  memory_details?: MemoryDetails;
  impulse_details?: ImpulseDetails;
  attention_details?: AttentionDetails;
  executive_details?: ExecutiveDetails;
}

export interface PatientProfile {
  user_id: string;
  user_name: string;
  age: number;
  age_group: string;
  gender: string;
  total_sessions: number;
  first_session_date: string | null;
  last_session_date: string | null;
  adhd_subtype: string | null;
  avg_domain_scores: DomainScores;
  trend_graph: TrendData[];
}

// Define the structure for the patient list item based on the API
interface PatientListItem {
  user_id: string;
  first_name: string;
  last_name: string;
  name: string;
  date_of_birth: string;
  gender: string;
  adhd_subtype: string | null;
  clinician_id: string;
  // Add any other fields returned by the /patients endpoint
}

// Add error handling wrapper
const handleApiError = (error: unknown, context: string = "API Request") => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error(
        `${context} - API Error Response:`,
        axiosError.response.data
      );
      console.error(`${context} - Status:`, axiosError.response.status);
      const errorMessage =
        typeof axiosError.response.data === "object" &&
        axiosError.response.data !== null
          ? (axiosError.response.data as any).detail ||
            JSON.stringify(axiosError.response.data)
          : `Error ${axiosError.response.status}: ${axiosError.message}`;
      throw new Error(errorMessage);
    } else if (axiosError.request) {
      console.error(`${context} - No response received:`, axiosError.request);
      throw new Error("No response from server. Please check your connection.");
    } else {
      console.error(
        `${context} - Error setting up request:`,
        axiosError.message
      );
      throw new Error(`Request setup error: ${axiosError.message}`);
    }
  } else {
    console.error(`${context} - Non-Axios error:`, error);
    throw error;
  }
};

// Fetch all patients for a clinician
const getPatientsByClinician = async (
  clinicianId: string
): Promise<PatientListItem[]> => {
  try {
    // Ensure API_BASE is correctly defined in ./config
    // Example: export const API_BASE = "http://localhost:8000";
    const response: AxiosResponse<PatientListItem[]> = await axios.get(
      `${API_BASE}/${clinicianId}/patients`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getPatientsByClinician");
  }
};

// Fetch a specific patient's details
const getPatientById = async (clinicianId: string, patientId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE}/${clinicianId}/patients/${patientId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getPatientById");
  }
};

// Add a new patient
const invitePatient = async (email: string) => {
  try {
    const token = localStorage.getItem("neurocog_token");
    const response = await axios.post(
      `${API_BASE}/generate-invitation-link?patient_email=${email}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return handleApiError(error, "invitePatient");
  }
};

// Add a new patient
const addPatient = async (clinicianId: string, patientData: any) => {
  try {
    const response = await axios.post(
      `${API_BASE}/${clinicianId}/patients`,
      patientData
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "addPatient");
  }
};

// Fetch the comprehensive cognitive profile for a patient
const getPatientProfile = async (userId: string): Promise<PatientProfile> => {
  try {
    // Assuming the profile endpoint is relative to the base URL or handled by proxy
    const response: AxiosResponse<PatientProfile> = await axios.get(
      `${API_BASE}/api/cognitive/profile/${userId}`
    );
    return response.data;
  } catch (error) {
    return handleApiError(error, "getPatientProfile");
  }
};

// Export the service methods
const PatientService = {
  getPatientsByClinician,
  getPatientById,
  getPatientProfile,
  addPatient,
  invitePatient,
};

export default PatientService;
