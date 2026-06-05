import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';

import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express();

await connectCloudinary();

const corsOptions = {
  origin: "https://useai-sigma.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// ✅ MUST be first
app.use(cors(corsOptions));

// ✅ handle preflight requests
app.options("*", cors(corsOptions));

// middlewares
app.use(express.json());
app.use(clerkMiddleware());

// routes
app.get('/', (req, res) => res.send('Server is Live'));

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

export default app;