import axios from "axios";
import { AuthResponse, NonceResponse } from "../types/auth";
import bs58 from "bs58";

// Replace with your actual API URL
const API_URL = " https://purrfect-chaos.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  getNonce: async (walletAddress: string): Promise<string> => {
    try {
      const response = await api.get<NonceResponse>(
        `/auth/nonce/${walletAddress}`
      );
      return response.data.data.nonce;
    } catch (error) {
      console.error("Error getting nonce:", error);
      throw error;
    }
  },

  verifySignature: async (
    walletAddress: string,
    signature: Uint8Array
  ): Promise<AuthResponse> => {
    try {
      // Convert the wallet address to ensure it's a string
      const wallet_address = String(walletAddress);

      // Create a proper payload that matches the RegisterReqBody expected by the backend
      const payload = {
        wallet_address,
        signature: { data: Array.from(signature) },
        verify: 1, // Add verify field as required by the backend
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Sending payload to server:", payload);

      const response = await api.post<{ message: string; data: AuthResponse }>(
        "/auth/verify",
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("wallet_address");
  },
};

export default api;
