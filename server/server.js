import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';

import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './configs/cloudinary.js';

const app = express();

await connectCloudinary();

// ✅ CORS (ONLY ONCE, CLEAN)
app.use(cors({
  origin: "https://useai-sigma.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// middlewares
app.use(express.json());
app.use(clerkMiddleware());

// routes
app.get('/', (req, res) => {
  res.send('Server is Live');
});

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

// ❌ IMPORTANT: NO app.listen()

export default app;