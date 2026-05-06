import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Generate user ID once per session (not per render)
let DEFAULT_USER_ID: string | null = null;

const getUserId = (): string => {
  if (!DEFAULT_USER_ID) {
    DEFAULT_USER_ID = "user_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 9);
  }
  return DEFAULT_USER_ID;
};

export interface DetectionResult {
  success: boolean;
  data?: {
    // URL / Email scan fields
    url?: string;
    subject?: string;
    body_snippet?: string;
    sender?: string;
    is_phishing?: boolean;        // URL and email scans

    // File scan fields
    is_malware?: boolean;         // file scans only
    sha256_hash?: string;         // file scans only

    // Common fields
    confidence: number;
    risk_level: string;
    timestamp: string;
    details?: Record<string, any>;
  };
  error?: string;
  request_id?: string;
}

export interface HistoryItem {
  _id: string;
  url?: string;
  subject?: string;
  body_snippet?: string;
  is_phishing: boolean;
  confidence: number;
  risk_level: string;
  timestamp: string;
}

export interface HistoryResponse {
  success: boolean;
  data?: {
    results: HistoryItem[];
    total: number;
  };
  error?: string;
}

/**
 * Detect if a URL is phishing
 */
export const detectURL = async (
  url: string,
  email?: string,
  userId?: string
): Promise<DetectionResult> => {
  try {
    const finalUserId = userId || getUserId();
    const response = await api.post("/api/detect", {
      url,
      email: email || undefined,
      user_id: finalUserId,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || "URL detection failed");
    }
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error || error?.message || "Failed to detect URL";
    console.error("URL detection error:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Detect if an email is phishing
 */
export const detectEmail = async (
  subject: string,
  body: string,
  sender?: string,
  userId?: string
): Promise<DetectionResult> => {
  try {
    const finalUserId = userId || getUserId();
    const response = await api.post("/api/detect/email", {
      subject,
      body,
      sender: sender || undefined,
      user_id: finalUserId,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || "Email detection failed");
    }
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error || error?.message || "Failed to detect email";
    console.error("Email detection error:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Detect if a file is malware
 */
export const detectFile = async (
  file: File,
  userId?: string
): Promise<DetectionResult> => {
  try {
    const finalUserId = userId || getUserId();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", finalUserId);

    const response = await api.post("/api/detect/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || "File detection failed");
    }
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error || error?.message || "Failed to detect file";
    console.error("File detection error:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get scan history for a user
 */
export const getHistory = async (
  userId?: string,
  limit: number = 20,
  offset: number = 0
): Promise<HistoryResponse> => {
  try {
    const finalUserId = userId || getUserId();
    const response = await api.get("/api/history", {
      params: {
        user_id: finalUserId,
        limit: Math.min(limit, 100),
        offset: Math.max(offset, 0),
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch history");
    }
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error || error?.message || "Failed to fetch history";
    console.error("History fetch error:", errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await api.get("/api/health");
    return response.data;
  } catch (error: any) {
    const errorMessage = error?.message || "Health check failed";
    console.error("Health check error:", errorMessage);
    throw new Error(errorMessage);
  }
};

export { getUserId };
