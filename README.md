# Contest Alert 🏆

**Live Demo:** [https://contest-alert-one.vercel.app](https://contest-alert-one.vercel.app)

Contest Alert is built with a separated client (Vite/React) and server (Node.js/Express) architecture. Follow these instructions to deploy the application to Vercel (Frontend) and Render (Backend).

## 1. Prepare MongoDB Atlas
Before deploying the backend, ensure your database is accessible from the production environment.
1. Go to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com).
2. Navigate to **Network Access** under the Security tab.
3. Click **Add IP Address** and add `0.0.0.0/0` (Allow Access from Anywhere) to ensure Render can connect to it. For tighter security, you can specify Render's outbound IP addresses instead.

## 2. Deploying the Backend (Render)
We will deploy the Express server as a Web Service on Render.

1. Create a new **Web Service** on Render and connect this repository.
2. Configure the following settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add the following **Environment Variables**:
   - `PORT`: `5001` (Render will automatically override this, but it's good practice)
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A strong random string for signing access tokens.
   - `JWT_REFRESH_SECRET`: A strong random string for signing refresh tokens.
   - `CLIST_API_KEY`: Your Clist.by API Key.
   - `CLIST_USERNAME`: Your Clist.by username.
   - `EMAIL_USER`: The Gmail address used for sending reminders.
   - `EMAIL_APP_PASSWORD`: The 16-character Google App Password.
   - `CLIENT_URL`: The URL of your Vercel frontend (you will add this *after* deploying the frontend in Step 3, e.g., `https://contest-alert.vercel.app`).
4. Click **Deploy**. Once deployed, copy your backend URL (e.g., `https://contest-alert-backend.onrender.com`).

## 3. Deploying the Frontend (Vercel)
We will deploy the React application on Vercel.

1. Go to [Vercel](https://vercel.com) and create a new project.
2. Import this repository.
3. Configure the following settings:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variables**:
   - `VITE_API_URL`: The URL of your deployed Render backend (e.g., `https://contest-alert-backend.onrender.com/api`).
5. Click **Deploy**.
6. Once deployed, copy your new Vercel URL and **add it to your Render backend's `CLIENT_URL` environment variable** so CORS works correctly.

## 4. Final Verification
- Visit your Vercel URL.
- Create an account and link your handles on the Profile page.
- Hit **Sync Now** to test the API integration.
- Go to Preferences and enable email reminders, ensuring the background cron jobs trigger correctly.

---
*Note on Cron Jobs: The background cron jobs (contest ingestion, reminders, profile sync) are completely environment-agnostic. They rely purely on your injected environment variables and MongoDB connection, making them fully safe for production.*
