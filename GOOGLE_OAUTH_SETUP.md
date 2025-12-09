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
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for development)
     - `http://localhost:5000` (for backend)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (for development)
     - Your production callback URL (e.g., `https://yourdomain.com/api/auth/google/callback`)
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

1. Update the `.env` file with production values:
   - `CLIENT_URL`: Your production frontend URL
   - `GOOGLE_CALLBACK_URL`: Your production backend callback URL
   - `NODE_ENV=production`
   - `SESSION_SECRET`: Use a strong, randomly generated secret

2. Update Google OAuth credentials:
   - Add your production domain to **Authorized JavaScript origins**
   - Add your production callback URL to **Authorized redirect URIs**

3. Ensure your backend server is accessible at the callback URL

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

