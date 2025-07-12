// server.js

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";

// Routes
import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import adminRoute from "./route/admin.route.js";
import ebookRoute from "./route/ebook.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;
const URI = process.env.MongoDBURI;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*'
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB Atlas
async function connectDB() {
  try {
    await mongoose.connect(URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("⚠️ Please check:");
    console.log("1. Your IP is whitelisted in MongoDB Atlas Network Access");
    console.log("2. Database credentials are correct");
    console.log("3. Cluster is running");
    process.exit(1);
  }
}
connectDB();

// Routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/ebooks", ebookRoute);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Stripe Payment Route
app.post("/api/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses smallest currency unit (paise)
      currency: "inr",
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
