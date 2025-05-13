
import parseJwt from "@/utils/helpers/parseJwt";
import axios from "axios";
import { toast } from "sonner";
import { API_BASE } from "./config";
import SessionManager from "./session-manager";

interface AuthResponse {
  user?: any;
  token?: string;
  access_token?: string;
  token_type?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterPatientData {
  name: string;
  email: string;
  password: string;
  dateOfBirth?: string;
  gender?: string;
  medicalHistory?: string;
}

interface RegisterClinicianData {
  name: string;
  email: string;
  password: string;
  specialty?: string;
  licenseNumber?: string;
  clinicName?: string;
}

// Login function
const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/login`, data);

    const token = response.data.access_token;
    if (token) {
      const decoded = parseJwt(token);
      // ✅ Check if role exists and is 'doctor'
      if (!decoded?.user_role || decoded.user_role !== "doctor") {
        throw new Error("Access denied. Only doctors can log in.");
      }

      localStorage.setItem("neurocog_token", token);

      // Store more comprehensive user data from the decoded token
      const userId = decoded.user_id || decoded.sub || decoded.id;
      const userData = {
        id: userId,
        email: decoded.email || data.email,
        name: decoded.name,
        user_role: decoded.user_role,
      };
      
      localStorage.setItem("neurocog_user", JSON.stringify(userData));

      SessionManager.resetTimer();

      toast.success("Login successful!");
      return {
        token,
        user: userData,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Register as patient function
const registerAsPatient = async (
  data: RegisterPatientData
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/register/patient`, data);

    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem("neurocog_token", response.data.token);
      
      // Parse token to get complete user data if available
      const token = response.data.token;
      const decoded = parseJwt(token);
      const userData = decoded || response.data.user;
      
      localStorage.setItem("neurocog_user", JSON.stringify(userData));

      // Initialize session management
      SessionManager.resetTimer();
      
      toast.success("Registration successful!");
    }

    return response.data;
  } catch (error: any) {
    console.error("Patient registration error:", error);
    throw error;
  }
};

// Register as clinician function
const registerAsClinician = async (
  data: RegisterClinicianData
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_BASE}/register/clinician`, data);

    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem("neurocog_token", response.data.token);
      
      // Parse token to get complete user data if available
      const token = response.data.token;
      const decoded = parseJwt(token);
      const userData = decoded || response.data.user;
      
      localStorage.setItem("neurocog_user", JSON.stringify(userData));

      // Initialize session management
      SessionManager.resetTimer();
      
      toast.success("Registration successful!");
    }

    return response.data;
  } catch (error: any) {
    console.error("Clinician registration error:", error);
    throw error;
  }
};

// Logout function
const logout = () => {
  // Remove auth related items from localStorage
  localStorage.removeItem("neurocog_token");
  localStorage.removeItem("neurocog_user");

  // Clear any session data or cookies if needed
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

// Get current user function
const getCurrentUser = () => {
  const userJson = localStorage.getItem("neurocog_user");
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error("Error parsing user data", e);
    return null;
  }
};

// Get user ID from token or stored user data
const getCurrentUserId = (): string | null => {
  // First try to get from stored user data
  const userData = getCurrentUser();
  if (userData && userData.id) {
    return userData.id;
  }
  
  // If not found, try to parse from token
  const token = localStorage.getItem("neurocog_token");
  if (token) {
    const decoded = parseJwt(token);
    if (decoded) {
      return decoded.user_id || decoded.sub || decoded.id;
    }
  }
  
  return null;
};

// Check if user is authenticated
const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("neurocog_token");
};

// Auth Service object
const AuthService = {
  login,
  registerAsPatient,
  registerAsClinician,
  logout,
  getCurrentUser,
  getCurrentUserId,
  isAuthenticated,
};

export default AuthService;
