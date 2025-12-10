# MongoDB Atlas Setup Guide

This guide will help you connect your application to MongoDB Atlas instead of a local MongoDB instance.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (or log in if you already have one)
3. Create a new cluster (Free tier M0 is available)

## Step 2: Create a Database User

1. In your Atlas dashboard, go to **Database Access** (left sidebar)
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Enter a username and generate a secure password (save this!)
5. Set user privileges to **Read and write to any database**
6. Click **Add User**

## Step 3: Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. For development, click **Allow Access from Anywhere** (0.0.0.0/0)
   - **Note:** For production, restrict this to your server's IP address
4. Click **Confirm**

## Step 4: Get Your Connection String

1. Go to **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Select **Node.js** as the driver
5. Copy the connection string (it looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

## Step 5: Update Your .env File

1. Open `server/.env` file
2. Replace the `MONGODB_URI` value with your connection string
3. Replace `<username>` with your database username
4. Replace `<password>` with your database password
5. Replace `<cluster>` with your cluster name (or keep it if it's already correct)
6. Make sure the database name is `Jerseylab` (or change it to your preferred name)

**Example:**
```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/Jerseylab?retryWrites=true&w=majority
```

## Step 6: Test the Connection

1. Start your server:
   ```bash
   cd server
   npm run dev
   ```

2. You should see: `Connected to MongoDB Atlas` in the console

3. If you see connection errors:
   - Verify your username and password are correct
   - Check that your IP address is whitelisted in Network Access
   - Ensure the connection string format is correct
   - Make sure you've replaced `<username>`, `<password>`, and `<cluster>` placeholders

## Troubleshooting

### Connection Timeout
- Check your internet connection
- Verify your IP is whitelisted in Atlas Network Access
- Try using the connection string with `?retryWrites=true&w=majority` parameters

### Authentication Failed
- Double-check your username and password
- Make sure there are no extra spaces in the connection string
- URL-encode special characters in your password (e.g., `@` becomes `%40`)

### Database Not Found
- The database will be created automatically when you first write data
- Or you can create it manually in the Atlas dashboard

## Security Notes

- **Never commit your `.env` file to Git** (it's already in `.gitignore`)
- Use strong passwords for your database user
- In production, restrict Network Access to your server's IP only
- Consider using environment variables on your hosting platform instead of `.env` files

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Mongoose Connection Guide](https://mongoosejs.com/docs/connections.html)

