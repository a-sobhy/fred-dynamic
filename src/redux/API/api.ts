import axios from "axios";

console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("API Key:", import.meta.env.VITE_API_KEY);

const url = "/api";
export const APIKEY = import.meta.env.VITE_API_KEY;

export const API = axios.create({
  baseURL: url,
  params: {
    api_key: APIKEY,
    file_type: "json",
  },
});
