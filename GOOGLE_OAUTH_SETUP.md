# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the Jerzey Lab application.

## Prerequisites

1. A Google Cloud Platform (GCP) account
2. Access to Google Cloud Console

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in the required information (App name, User support email, Developer contact)
   - Add scopes: `email` and `profile`
   - Add test users if needed (for development)
6. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: **Jerzey Lab OAuth Client**
   - **Authorized JavaScript origins** (where your frontend is hosted):
     - **IMPORTANT**: Only use the base domain, NO paths, NO trailing slashes
     - `http://localhost:5173` (for local development - no trailing slash)
     - `https://houssam-houssein.github.io` (your GitHub Pages base URL - NO `/jersey-lab` path)
     - **Do NOT include**: `/jersey-lab` or any other path
     - **Do NOT include**: Trailing slashes like `/`
     - Examples of what NOT to use:
       - ❌ `https://houssam-houssein.github.io/jersey-lab`
       - ❌ `https://houssam-houssein.github.io/`
       - ❌ `http://localhost:5173/`
   - **Authorized redirect URIs** (where your backend server is hosted - NOT GitHub Pages):
     - `http://localhost:5000/api/auth/google/callback` (for local development)
     - `https://your-backend-server.com/api/auth/google/callback` (your production backend URL)
     - **Important**: This must point to your Node.js backend server, NOT GitHub Pages
     - GitHub Pages only serves static files, so your backend must be hosted separately (Railway, Render, Heroku, etc.)
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

1. In the `server` folder, create a `.env` file (if it doesn't exist)
2. Add the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS and redirects)
CLIENT_URL=http://localhost:5173

# Session Secret (generate a random string for production)
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

3. Replace the placeholder values with your actual credentials:
   - `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret
   - `SESSION_SECRET`: Generate a random string (you can use: `openssl rand -base64 32`)
   - `CLIENT_URL`: Your frontend URL (default: `http://localhost:5173`)
   - `GOOGLE_CALLBACK_URL`: Your backend callback URL (default: `http://localhost:5000/api/auth/google/callback`)

## Step 3: Configure Frontend Environment (Optional)

If you're using a different backend URL, create a `.env` file in the `client` folder:

```env
VITE_API_URL=http://localhost:5000
```

## Step 4: Start the Application

1. Install dependencies (if not already done):
   ```bash
   cd server
   npm install
   ```

2. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

3. Start the frontend (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

## Step 5: Test the Authentication

1. Navigate to `http://localhost:5173/login`
2. Click **Log in with Google**
3. You should be redirected to Google's login page
4. After successful authentication, you'll be redirected back to the homepage
5. Check the navbar - you should see your name and profile picture

## Production Setup

For production deployment:

1. **Host your backend server** (required - GitHub Pages can't run Node.js):
   - Options: Railway, Render, Heroku, Vercel (serverless), DigitalOcean, etc.
   - Your backend must be accessible via HTTPS
   - Example backend URL: `https://nba-store-api.railway.app` or `https://api.yourdomain.com`

2. Update the `.env` file on your backend server with production values:
   - `CLIENT_URL`: Your GitHub Pages frontend URL (e.g., `https://houssam-houssein.github.io/jersey-lab`)
   - `GOOGLE_CALLBACK_URL`: Your production backend callback URL (e.g., `https://your-backend.railway.app/api/auth/google/callback`)
   - `NODE_ENV=production`
   - `SESSION_SECRET`: Use a strong, randomly generated secret

3. Update Google OAuth credentials in Google Cloud Console:
   - **Authorized JavaScript origins**: 
     - Add your GitHub Pages base URL (e.g., `https://houssam-houssein.github.io`)
     - **NO paths, NO trailing slashes** - just the base domain
     - ❌ Wrong: `https://houssam-houssein.github.io/jersey-lab`
     - ✅ Correct: `https://houssam-houssein.github.io`
   - **Authorized redirect URIs**: 
     - Add your backend server callback URL (e.g., `https://your-backend.railway.app/api/auth/google/callback`)
     - **Important**: The redirect URI must point to your backend server, NOT GitHub Pages

4. Ensure your backend server is accessible and the callback endpoint works

## Troubleshooting

### "redirect_uri_mismatch" Error
- Make sure the callback URL in your `.env` file matches exactly what's configured in Google Cloud Console
- Check that the URL doesn't have trailing slashes

### CORS Errors
- Verify `CLIENT_URL` in your `.env` matches your frontend URL
- Check that `credentials: true` is set in the CORS configuration

### Session Not Persisting
- Ensure cookies are enabled in your browser
- Check that `SESSION_SECRET` is set and consistent
- Verify the session cookie settings match your deployment environment

### User Not Appearing After Login
- Check browser console for errors
- Verify the backend `/api/auth/user` endpoint is accessible
- Ensure the frontend is making requests with `credentials: 'include'`

## Security Notes

- **Never commit** your `.env` file to version control
- Use strong, randomly generated `SESSION_SECRET` in production
- Keep your `GOOGLE_CLIENT_SECRET` secure
- Regularly rotate your OAuth credentials
- Use HTTPS in production

