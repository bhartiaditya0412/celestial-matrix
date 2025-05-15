import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

async function makeRequest(url, options = {}) {
  try {
    console.log("before making request")
    console.log("options ====>> ", options)
    const response = await api(url, options);
    console.log("in the makeRequest function", response.data);
    return response.data; // ✅ RETURN DATA HERE
  } catch (error) {
    
    console.error("makeRequest error:", error.response?.data?.message || error.message);
    throw error.response?.data?.message || "ERROR HERE";
  }
}

export default makeRequest;
