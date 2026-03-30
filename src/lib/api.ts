import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

export const scanURL = async (url: string) => {
  try {
    const response = await api.post("/api/scan/url", { url });
    return response.data;
  } catch (error) {
    console.error("Error scanning URL:", error);
    throw error;
  }
};

export const scanFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/api/scan/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error scanning file:", error);
    throw error;
  }
};
