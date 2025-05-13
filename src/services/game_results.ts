import axios from "axios";
import { API_BASE } from "./config";

// Retrieve all sessions, game results, and matrices for a user
const getUserData = (user_id) => {
  return axios.get(API_BASE + `/user-data/${user_id}`);
};

// Create sessions, game results, and mini-game matrices for a user
const createUserData = (data) => {
  return axios.post(API_BASE + `/user-data/`, data);
};

// Optional: Root and health check (in case you want to use them somewhere)
const getRoot = () => {
  return axios.get(API_BASE + `/`);
};

const checkHealth = () => {
  return axios.get(API_BASE + `/health`);
};

const GameService = {
  getUserData,
  createUserData,
  getRoot,
  checkHealth,
};

export default GameService;
