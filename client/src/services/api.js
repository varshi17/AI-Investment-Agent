// src/services/api.js
import axios from "axios";

// Should be http://localhost:5000 (not 5001)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("🌐 API_URL:", API_URL); // <-- Check this in browser console

const API = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

export default API;