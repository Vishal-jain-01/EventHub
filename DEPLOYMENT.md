# EventHub Deployment Guide

This guide will help you deploy the EventHub application - Backend on Render and Frontend on Vercel.

## 📋 Prerequisites

Before deploying, make sure you have:
- A GitHub account with this repository
- A [Render](https://render.com) account (free tier available)
- A [Vercel](https://vercel.com) account (free tier available)
- A MongoDB Atlas database (or any MongoDB instance)
- Gmail account for email notifications (with App Password enabled)

---

## 🚀 Backend Deployment (Render)

### Step 1: Prepare MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster (if you haven't already)
3. Go to Database Access → Add Database User
4. Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
5. Get your connection string from Connect → Connect your application
6. It should look like: `mongodb+srv://username:password@cluster.mongodb.net/eventhub?retryWrites=true&w=majority`

### Step 2: Setup Gmail App Password

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Save this password (you'll need it for EMAIL_PASS)

### Step 3: Deploy Backend on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Create a New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Vishal-jain-01/EventHub`
   - Give it a name: `eventhub-backend`

3. **Configure the Service:**
   - **Root Directory:** `EventManagementBackend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/index.js`
   - **Plan:** Free

4. **Add Environment Variables:**
   Click "Environment" tab and add these variables:
   
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   FRONTEND_URL=https://your-app.vercel.app
   ```

   **Important Notes:**
   - Generate a strong JWT_SECRET (e.g., use: `openssl rand -base64 32`)
   - Use the Gmail App Password (not your regular Gmail password)
   - Update FRONTEND_URL after deploying frontend

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for the deployment to complete (5-10 minutes)
   - Copy your backend URL (e.g., `https://eventhub-backend.onrender.com`)

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update API Configuration

1. **Create Production Environment File:**
   - In your `event-management-frontend` folder
   - Create a file named `.env.production`
   - Add your Render backend URL:
   ```
   VITE_API_BASE_URL=https://eventhub-backend.onrender.com
   ```

### Step 2: Deploy Frontend on Vercel

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `Vishal-jain-01/EventHub`
   - Click "Import"

3. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `event-management-frontend`
   - **Build Command:** `npm run build` (should be auto-detected)
   - **Output Directory:** `dist` (should be auto-detected)

4. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   VITE_API_BASE_URL=https://eventhub-backend.onrender.com
   ```
   (Use your actual Render backend URL)

5. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete (2-5 minutes)
   - Copy your frontend URL (e.g., `https://eventhub.vercel.app`)

### Step 3: Update Backend CORS Settings

1. Go back to your Render dashboard
2. Open your backend service
3. Go to Environment variables
4. Update `FRONTEND_URL` with your actual Vercel URL:
   ```
   FRONTEND_URL=https://eventhub.vercel.app
   ```
5. Save changes - Render will automatically redeploy

---

## ✅ Testing Your Deployment

1. **Visit your Vercel frontend URL**
2. **Try to register a new account**
3. **Check if you receive the welcome email**
4. **Try logging in and creating an event**

---

## 🔧 Troubleshooting

### Backend Issues:

**Deployment Failed:**
- Check Render logs for errors
- Verify all environment variables are set correctly
- Ensure MongoDB URI is correct and accessible

**CORS Errors:**
- Verify FRONTEND_URL in Render matches your Vercel URL exactly
- Make sure there's no trailing slash in the URL

**Database Connection Failed:**
- Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0)
- Verify MongoDB URI format
- Check database user permissions

**Email Not Sending:**
- Verify you're using Gmail App Password (not regular password)
- Check EMAIL_USER and EMAIL_PASS are correct
- Enable "Less secure app access" if using regular password (not recommended)

### Frontend Issues:

**API Not Connecting:**
- Check VITE_API_BASE_URL in Vercel environment variables
- Verify backend is running on Render
- Check browser console for CORS errors

**Build Failed:**
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Try building locally first: `npm run build`

---

## 📝 Important Notes

1. **Free Tier Limitations:**
   - Render free tier spins down after 15 minutes of inactivity
   - First request after inactivity may take 30-60 seconds
   - Consider upgrading for production use

2. **Database Backups:**
   - MongoDB Atlas free tier has limited backups
   - Consider setting up regular backups for production

3. **Environment Variables:**
   - Never commit .env files to GitHub
   - Always use environment variables for sensitive data
   - Update JWT_SECRET to a strong random value

4. **Custom Domain (Optional):**
   - Both Render and Vercel support custom domains
   - Configure in their respective dashboards
   - Update FRONTEND_URL and VITE_API_BASE_URL accordingly

---

## 🔄 Redeployment

### Backend (Render):
- Automatic: Push changes to GitHub master branch
- Manual: Go to Render dashboard → Manual Deploy

### Frontend (Vercel):
- Automatic: Push changes to GitHub master branch
- Manual: Go to Vercel dashboard → Redeploy

---

## 📞 Support

If you encounter issues:
1. Check deployment logs (Render/Vercel dashboards)
2. Verify all environment variables
3. Test API endpoints directly using Postman
4. Check MongoDB Atlas connectivity

---

## 🎉 Success!

Once deployed, your EventHub application will be accessible at:
- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://your-backend.onrender.com

Share your links and start managing events! 🚀
