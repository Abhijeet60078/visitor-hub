import { OAUTH_CONFIG } from "@/config/oauth";

/**
 * OAuth Helper Functions
 */

/**
 * Handle Google OAuth token verification
 */
export const handleGoogleOAuth = async (token) => {
  try {
    const response = await fetch(`${OAUTH_CONFIG.API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`Google OAuth failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Store authentication token
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Google OAuth error:", error);
    throw error;
  }
};

/**
 * Handle Facebook OAuth token verification
 */
export const handleFacebookOAuth = async (accessToken, userID) => {
  try {
    const response = await fetch(`${OAUTH_CONFIG.API_BASE_URL}/auth/facebook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken, userID }),
    });

    if (!response.ok) {
      throw new Error(`Facebook OAuth failed: ${response.statusText}`);
    }

    const data = await response.json();

    // Store authentication token
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error("Facebook OAuth error:", error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

/**
 * Get stored authentication token
 */
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

/**
 * Get stored user info
 */
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Get authorization header for API calls
 */
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
