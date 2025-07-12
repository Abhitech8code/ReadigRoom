# Deployment Guide for BookStore Project

## Frontend Deployment (Render/Netlify)

### 1. Environment Variables
Create `.env` file in Frontend folder:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

### 2. Build Settings
- Build Command: `npm run build`
- Publish Directory: `dist`

### 3. Redirects
The `_redirects` file is already created for SPA routing.

## Backend Deployment (Render)

### 1. Environment Variables
Set these in Render dashboard:
```
NODE_ENV=production
MongoDBURI=mongodb+srv://username:password@cluster.mongodb.net/bookstore
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### 2. Build Settings
- Build Command: `npm install`
- Start Command: `npm start`

## Database Setup (MongoDB Atlas)

1. Create MongoDB Atlas cluster
2. Whitelist all IPs (0.0.0.0/0) for production
3. Create database user with read/write permissions
4. Get connection string and add to environment variables

## Stripe Setup

1. Get Stripe publishable and secret keys
2. Add secret key to backend environment
3. Add publishable key to frontend code

## Common Issues & Fixes

1. **Pages not showing**: `_redirects` file handles SPA routing
2. **CORS errors**: Backend CORS is configured for production
3. **API calls failing**: Check API_BASE_URL configuration
4. **Build failures**: Ensure all dependencies are in package.json

## Deployment Steps

### Backend (Render)
1. Connect GitHub repository
2. Select backend folder as root directory
3. Set environment variables
4. Deploy

### Frontend (Render/Netlify)
1. Connect GitHub repository
2. Select frontend folder as root directory
3. Set build command and publish directory
4. Set environment variables
5. Deploy

## Post-Deployment
1. Test all routes and functionality
2. Verify payment processing
3. Check file uploads work
4. Test authentication flows