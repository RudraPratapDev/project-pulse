import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Custom hook for API calls with loading and error states
 */
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = async (method, endpoint, data = null) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        method,
        url: `${API_URL}${endpoint}`,
        ...(data && { data })
      };

      const response = await axios(config);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const get = (endpoint) => request('GET', endpoint);
  const post = (endpoint, data) => request('POST', endpoint, data);
  const put = (endpoint, data) => request('PUT', endpoint, data);
  const del = (endpoint) => request('DELETE', endpoint);

  return { loading, error, get, post, put, del };
};
