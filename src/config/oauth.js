/**
 * OAuth Configuration
 * 
 * To enable Google and Facebook login, add your credentials here:
 * 
 * 1. Google OAuth:
 *    - Get your Google Client ID from: https://console.cloud.google.com/
 *    - Add it to GOOGLE_CLIENT_ID below
 * 
 * 2. Facebook OAuth:
 *    - Get your Facebook App ID from: https://developers.facebook.com/
 *    - Add it to FACEBOOK_APP_ID below
 */

export const OAUTH_CONFIG = {
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE",
  
  // Facebook OAuth Configuration
  FACEBOOK_APP_ID: import.meta.env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID_HERE",
  
  // API endpoint for backend OAuth verification
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
};

/**
 * Setup Instructions:
 * 
 * 1. Create a .env.local file in your project root with:
 *    VITE_GOOGLE_CLIENT_ID=your_google_client_id
 *    VITE_FACEBOOK_APP_ID=your_facebook_app_id
 *    VITE_API_BASE_URL=http://localhost:3000/api
 * 
 * 2. Update your backend to handle OAuth token verification
 *    - Create endpoint: POST /api/auth/google
 *    - Create endpoint: POST /api/auth/facebook
 */
