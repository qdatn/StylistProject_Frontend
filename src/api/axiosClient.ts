// apiClient.js
import getTokenFromCookies from "@utils/getCookie";
import axios, { AxiosResponse } from "axios";

const baseURL = import.meta.env.BASE_URL;

function createApiClient() {
  const client = axios.create({
    baseURL,
    // timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Interceptor to add the token to every request
  // client.interceptors.request.use(
  //   (config) => {
  //     const token = getTokenFromCookies();
  //     if (token) {
  //       config.headers["Authorization"] = `Bearer ${token}`;
  //     }
  //     return config;
  //   },
  //   (error) => Promise.reject(error)
  // );

  return {
    getOne: async <T>(
      endpoint: string,
      params: Record<string, any> = {}
    ): Promise<T> => {
      try {
        const response: AxiosResponse<T> = await client.get(endpoint, {
          params,
        });
        return response.data;
      } catch (error) {
        throw new Error(`GET request to ${endpoint} failed: ${error}`);
      }
    },

    getMany: async <T>(endpoint: string, params = {}): Promise<T[]> => {
      try {
        const response: AxiosResponse<T[]> = await client.get(endpoint, {
          params,
        });
        return response.data;
      } catch (error) {
        throw new Error(`POST request to ${endpoint} failed: ${error}`);
      }
    },

    post: async <T>(
      endpoint: string,
      data: Record<string, any>
    ): Promise<T> => {
      try {
        const response: AxiosResponse<T> = await client.post(endpoint, data);
        return response.data;
      } catch (error) {
        throw new Error(`PUT request to ${endpoint} failed: ${error}`);
      }
    },

    put: async <T>(endpoint: string, data: Record<string, any>): Promise<T> => {
      try {
        const response: AxiosResponse<T> = await client.put(endpoint, data);
        return response.data;
      } catch (error) {
        throw new Error(`PUT request to ${endpoint} failed: ${error}`);
      }
    },

    delete: async <T>(
      endpoint: string
      // params: Record<string, any> = {}
    ): Promise<T> => {
      try {
        const response: AxiosResponse<T> = await client.delete(endpoint);
        return response.data;
      } catch (error) {
        throw new Error(`DELETE request to ${endpoint} failed: ${error}`);
      }
    },
  };
}

// Create a default instance of the API client
const axiosClient = createApiClient();

export default axiosClient;
