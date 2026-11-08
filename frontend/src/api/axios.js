// axios.js — centralised Axios instance
// All API calls go through this file so the base URL is set in one place.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
