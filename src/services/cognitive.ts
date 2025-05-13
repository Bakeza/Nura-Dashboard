
import axios from "axios";
import { API_BASE } from "./config";

export interface CognitiveProfileResponse {
  data: {
    trend_graph?: any[];
    [key: string]: any;
  }
}

const getCognitiveProfile = (user_id: string): Promise<CognitiveProfileResponse> => {
  return axios.get(API_BASE + `/api/cognitive/profile/${user_id}`);
};

const CognitiveService = {
  getCognitiveProfile,
};

export default CognitiveService;
