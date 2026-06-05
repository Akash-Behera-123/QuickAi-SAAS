import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';

import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './configs/cloudinary.js';

const app = express();

// ✅ connect services
await connectCloudinary();

/* --------------------------------------------------
   ✅ FIX 1: MANUAL PRE-FLIGHT HANDLER (IMPORTANT)
-------------------------------------------------- */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://useai-sigma.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

/* --------------------------------------------------
   ✅ FIX 2: CORS MIDDLEWARE
-------------------------------------------------- */
app.use(cors({
  origin: "https://useai-sigma.vercel.app",
  credentials: true
}));

/* --------------------------------------------------
   ✅ BASIC MIDDLEWARES
-------------------------------------------------- */
app.use(express.json());
app.use(clerkMiddleware());

/* --------------------------------------------------
   ROUTES
-------------------------------------------------- */
app.get('/', (req, res) => {
  res.send('Server is Live');
});

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

/* --------------------------------------------------
   EXPORT FOR VERCEL
-------------------------------------------------- */
export default app;