
import axios from "axios";
import { API_BASE } from "../config";

/**
 * Add a new session to the database
 */
export const addSession = (data: any) => {
  return axios.post(`${API_BASE}/session`, data);
};
