import axios from "axios";
import { API_BASE } from "./config";

const createCropMetrics = (result_id, data) => {
  return axios.post(`${API_BASE}/metrics/crop/${result_id}`, data);
};

const createSequenceMetrics = (result_id, data) => {
  return axios.post(API_BASE + `/metrics/sequence/${result_id}`, data);
};

const getSequenceMetrics = (result_id) => {
  return axios.get(API_BASE + `/metrics/sequence/${result_id}`);
};

const createMatchingMetrics = (result_id, data) => {
  return axios.post(API_BASE + `/metrics/matching/${result_id}`, data);
};

const MetricsService = {
  createCropMetrics,
  createSequenceMetrics,
  getSequenceMetrics,
  createMatchingMetrics,
};

export default MetricsService;
