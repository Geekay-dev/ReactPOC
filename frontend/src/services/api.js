// src/services/api.js
import axios from "axios";

export const BASE_URL = "http://localhost:5084";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default api;
