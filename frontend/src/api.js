import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // 20s request timeout to prevent hanging UI
});

// Attach authentication JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('placementiq_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Maximum retry attempts for idempotent GET requests
const MAX_RETRIES = 2;

// Resilient response interceptor with exponential backoff retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Handle 401 Unauthorized (invalid/expired session)
    if (error.response && error.response.status === 401) {
      if (config?.url && !config.url.includes('/auth/me')) {
        localStorage.removeItem('placementiq_token');
        localStorage.removeItem('placementiq_user');
      }
      return Promise.reject(error);
    }

    // Determine if request is retryable (idempotent GET request on network error or server 5xx)
    const isGet = config?.method?.toLowerCase() === 'get';
    const isNetworkOrServerError =
      !error.response || (error.response.status >= 500 && error.response.status <= 504);

    if (config && isGet && isNetworkOrServerError) {
      config.__retryCount = config.__retryCount || 0;

      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        const delayMs = config.__retryCount * 500; // 500ms, 1000ms backoff

        if (import.meta.env.DEV) {
          console.warn(
            `[API Retry] ${config.url} attempt ${config.__retryCount} of ${MAX_RETRIES} in ${delayMs}ms...`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return api(config);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Normalizes error messages from FastAPI/Axios into clean user-facing copy
 */
export function getErrorMessage(error, defaultMsg = 'An unexpected error occurred') {
  if (!error) return defaultMsg;
  if (error.response?.data?.detail) {
    const detail = error.response.data.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || JSON.stringify(d)).join(', ');
    }
    return JSON.stringify(detail);
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message === 'Network Error') {
    return 'Unable to reach backend server. Please verify network connection.';
  }
  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please try again.';
  }
  return error.message || defaultMsg;
}

export default api;
