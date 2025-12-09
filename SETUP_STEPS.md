# Step-by-Step Google OAuth Setup Guide

Follow these steps in order to set up Google OAuth authentication.

## 📋 Step 1: Get Google OAuth Credentials

### 1.1 Go to Google Cloud Console
- Open your browser and go to: **https://console.cloud.google.com/**
- Sign in with your Google account

### 1.2 Create or Select a Project
- Click the project dropdown at the top
- Click **"New Project"** or select an existing project
- If creating new: Enter project name (e.g., "Jerzey Lab") and click **"Create"**

### 1.3 Configure OAuth Consent Screen
- In the left sidebar, go to **"APIs & Services"** > **"OAuth consent screen"**
- Choose **"External"** (unless you have a Google Workspace)
- Click **"Create"**
- Fill in the required fields:
  - **App name**: Jerzey Lab (or your app name)
  - **User support email**: Your email
  - **Developer contact information**: Your email
- Click **"Save and Continue"**
- On **Scopes** page: Click **"Save and Continue"** (we'll add scopes later)
- On **Test users** page: Click **"Save and Continue"** (optional for now)
- On **Summary** page: Click **"Back to Dashboard"**

### 1.4 Create OAuth Credentials
- Go to **"APIs & Services"** > **"Credentials"**
- Click **"+ CREATE CREDENTIALS"** at the top
- Select **"OAuth client ID"**
- If prompted, select **"Web application"** as the application type
- Fill in:
  - **Name**: Jerzey Lab OAuth Client
  - **Authorized JavaScript origins**: 
    - Click **"+ ADD URI"** and add: `http://localhost:5173`
    - Click **"+ ADD URI"** and add: `http://localhost:5000`
  - **Authorized redirect URIs**:
    - Click **"+ ADD URI"** and add: `http://localhost:5000/api/auth/google/callback`
- Click **"Create"**
- **IMPORTANT**: Copy the **Client ID** and **Client Secret** (you'll need these next!)
  - You can also download the JSON file if you prefer

---

## 📝 Step 2: Configure Your .env File

### 2.1 Open the .env file
- Navigate to the `server` folder in your project

- Open the `.env` file (I've created a template for you)

### 2.2 Update the credentials
Replace these values in the `.env` file:
ioioooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo

```env
GOOGLE_CLIENT_ID=paste-your-client-id-here
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

### 2.3 Generate a Session Secret (Optional but Recommended)
You can use this PowerShell command to generate a random secret:

```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Or use an online generator, or just use a long random string.

Update this line:
```env
SESSION_SECRET=your-generated-secret-here
```

---

## 🚀 Step 3: Install Dependencies & Start Servers

### 3.1 Install Server Dependencies
Open PowerShell/Terminal in the project root and run:

```powershell
cd server
npm install
```

### 3.2 Start the Backend Server
Keep the terminal open and run:

```powershell
npm run dev
```

You should see: `Server is running on port 5000`

### 3.3 Start the Frontend (New Terminal)
Open a **new** terminal window and run:

```powershell
cd client
npm run dev
```

You should see the Vite dev server running (usually on port 5173)

---

## ✅ Step 4: Test the Login

### 4.1 Open the Login Page
- Open your browser and go to: **http://localhost:5173/login**

### 4.2 Test Google Login
- Click the **"Log in with Google"** button
- You should be redirected to Google's login page
- Sign in with your Google account
- You may see a warning about "Google hasn't verified this app" - click **"Advanced"** then **"Go to Jerzey Lab (unsafe)"** (this is normal for development)
- After signing in, you should be redirected back to your homepage

### 4.3 Verify Login Success
- Check the navbar - you should see:
  - Your profile picture
  - Your name
  - A "Logout" button

---

## 🐛 Troubleshooting

### Problem: "redirect_uri_mismatch" error
**Solution**: 
- Make sure the redirect URI in your `.env` file exactly matches what you entered in Google Cloud Console
- Check for trailing slashes - they must match exactly
- The URI should be: `http://localhost:5000/api/auth/google/callback`

### Problem: "Access blocked" or "App not verified"
**Solution**: 
- This is normal for development/testing
- Click "Advanced" then "Go to [Your App Name] (unsafe)"
- For production, you'll need to verify your app with Google

### Problem: CORS errors in browser console
**Solution**:
- Make sure `CLIENT_URL` in `.env` is set to `http://localhost:5173`
- Make sure both servers are running
- Check that the backend server is on port 5000

### Problem: User not showing after login
**Solution**:
- Check browser console for errors
- Make sure both frontend and backend are running
- Try clearing browser cookies and logging in again
- Check that the `/api/auth/user` endpoint is accessible

---

## 📸 Quick Reference

**Google Cloud Console**: https://console.cloud.google.com/

**Your .env file location**: `server/.env`

**Backend URL**: http://localhost:5000

**Frontend URL**: http://localhost:5173

**Login Page**: http://localhost:5173/login

**Callback URL** (for Google): http://localhost:5000/api/auth/google/callback

---

## 🎉 You're Done!

Once you've completed these steps, Google OAuth should be working! Users can now log in with their Google accounts.

If you need help with any step, let me know!


