# Render Deployment Guide

This guide will help you deploy your Jerzey Lab application to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your MongoDB Atlas connection string (or local MongoDB URI)
3. Google OAuth credentials (if using Google login)
4. Email service credentials (if using email features)

## Deployment Steps

### 1. Push render.yaml to GitHub

Make sure your `render.yaml` file is committed and pushed to your main branch:

```bash
git add render.yaml
git commit -m "Add Render deployment configuration"
git push origin main
```

### 2. Create Services on Render

#### Option A: Using render.yaml (Recommended)

1. Go to your Render Dashboard
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create both services

#### Option B: Manual Setup

If you prefer to set up manually:

**Backend Service:**
1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `jerzey-lab-api`
   - **Root Directory**: Leave empty (or set to `server` if needed)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`

**Frontend Service:**
1. Go to Render Dashboard → "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `jerzey-lab-client`
   - **Root Directory**: Leave empty
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`

### 3. Configure Environment Variables

#### Backend Service Environment Variables

Go to your backend service settings → "Environment" and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Already set in render.yaml |
| `PORT` | `10000` | Already set in render.yaml |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `SESSION_SECRET` | (auto-generated) | Already set in render.yaml |
| `GOOGLE_CLIENT_ID` | `your-client-id` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | `your-client-secret` | From Google Cloud Console |
| `CLIENT_URL` | `https://jerzey-lab-client.onrender.com` | Your frontend URL |
| `EMAIL_HOST` | `smtp.gmail.com` | Your email service host (optional) |
| `EMAIL_PORT` | `587` | Your email service port (optional) |
| `EMAIL_USER` | `your-email@gmail.com` | Your email address (optional) |
| `EMAIL_PASS` | `your-app-password` | Your email app password (optional) |

#### Frontend Service Environment Variables

Go to your frontend service settings → "Environment" and add:

| Key | Value | Notes |
|-----|-------|-------|
| `VITE_API_URL` | `https://jerzey-lab-api.onrender.com` | Your backend service URL |

**Important**: Replace `jerzey-lab-api` with your actual backend service name if different.

### 4. Update CORS Settings

After deployment, make sure your backend's `CLIENT_URL` environment variable matches your frontend URL. The backend will automatically allow requests from this origin.

### 5. Deploy

1. Render will automatically deploy when you push to the main branch
2. Or manually trigger a deploy from the Render dashboard
3. Wait for both services to build and deploy successfully

### 6. Verify Deployment

1. Check backend health: `https://jerzey-lab-api.onrender.com/api/health` (if you have a health endpoint)
2. Visit your frontend: `https://jerzey-lab-client.onrender.com`
3. Test login, signup, and other features

## Troubleshooting

### Build Failures

- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### CORS Errors

- Verify `CLIENT_URL` matches your frontend URL exactly
- Check backend logs for CORS warnings

### Database Connection Issues

- Verify `MONGODB_URI` is correct
- Ensure MongoDB Atlas allows connections from Render's IPs (0.0.0.0/0)
- Check MongoDB Atlas network access settings

### Environment Variables Not Working

- For frontend: Vite env vars must be prefixed with `VITE_`
- Environment variables are injected at build time for static sites
- Rebuild the service after changing environment variables

## Notes

- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds
- Consider upgrading to paid plan for always-on services
- Database connection pooling is recommended for production

