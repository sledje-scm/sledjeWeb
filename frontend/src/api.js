import axios from "axios";

const API = axios.create({
  // baseURL: "https://sledjeweb-2.onrender.com/api", // backend URL
  baseURL: "http://localhost:5000/api", // for local development
});

// If you want to attach token for logged-in routes later:
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
