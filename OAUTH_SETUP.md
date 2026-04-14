# OAuth Setup Guide

## Google OAuth Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name your project (e.g., "Visitor Management System")

### Step 2: Enable Google+ API
1. In the Google Cloud Console, go to APIs & Services
2. Click "Enable APIs and Services"
3. Search for "Google+ API"
4. Click "Enable"

### Step 3: Create OAuth Credentials
1. Go to APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Name your credential (e.g., "VMS Web Client")
5. Add Authorized redirect URIs:
   - `http://localhost:8080`
   - `http://localhost:5173`
   - `https://yourdomain.com`

### Step 4: Copy Client ID
1. Click on your created credential
2. Copy the "Client ID"
3. Add it to `.env.local`:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   ```

---

## Facebook OAuth Setup

### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Consumer" as the app type
4. Fill in the required information

### Step 2: Add Facebook Login Product
1. In your app dashboard
2. Click "Add Product"
3. Find "Facebook Login" and click "Set Up"

### Step 3: Configure OAuth Redirect URIs
1. Go to Facebook Login → Settings
2. Add OAuth Redirect URIs:
   - `http://localhost:8080/`
   - `http://localhost:5173/`
   - `https://yourdomain.com/`

### Step 4: Get App ID
1. Go to Settings → Basic
2. Copy the "App ID"
3. Add it to `.env.local`:
   ```
   VITE_FACEBOOK_APP_ID=your_app_id_here
   ```

---

## Backend Integration

Your backend needs to handle OAuth token verification:

### Google Login Endpoint
```
POST /api/auth/google
Content-Type: application/json

{
  "token": "google_id_token"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### Facebook Login Endpoint
```
POST /api/auth/facebook
Content-Type: application/json

{
  "accessToken": "facebook_access_token",
  "userID": "facebook_user_id"
}

Response:
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

---

## Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your credentials to `.env.local`

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Troubleshooting

### Google Login Not Working
- Check if Client ID is correct in `.env.local`
- Verify redirect URIs match in Google Cloud Console
- Check browser console for errors

### Facebook Login Not Working
- Check if App ID is correct in `.env.local`
- Verify App is still active in Facebook Developers
- Check callback URL matches in Facebook settings

### CORS Errors
- Make sure backend has proper CORS headers
- Add frontend origin to backend CORS whitelist

---

## Production Deployment

1. Update redirect URIs in Google Cloud Console and Facebook Dashboard with production URLs
2. Update `VITE_API_BASE_URL` to production backend URL
3. Ensure HTTPS is enabled for production
4. Never commit `.env.local` to version control
