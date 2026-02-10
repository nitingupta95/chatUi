import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { toast } from "sonner";

const apiUrl ="http://localhost:8000"

const apiClient = axios.create({
  baseURL: apiUrl,  
});

// Request interceptor: Add access token to headers
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getCookie("refreshToken");
      const token = getCookie("token");

      if (!refreshToken || !token) {
        return Promise.reject(error);
      }
      try {
        const res = await axios.post(
          `${apiUrl}/auth/refresh-token`,
          { refreshToken: `Bearer ${refreshToken}` },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (res.data?.token) {
          // Save new tokens in cookies
          setCookie("token", res.data.token);
          setCookie("refreshToken", res.data.refreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
          return apiClient(originalRequest);
        } else {
          toast.error("Please login again, session expired 😉!!");
          logoutUser();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Utility function to log user out
function logoutUser() {
  deleteCookie("token");
  deleteCookie("refreshToken");
  window.location.href = "/auth/login"; // Redirect to login page
}

export { apiClient };
