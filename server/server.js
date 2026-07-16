import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware } from '@clerk/express';

import aiRouter from './routes/aiRoutes.js';
import userRouter from './routes/userRoutes.js';
import connectCloudinary from './configs/cloudinary.js';

const app = express();
console.log("🔥 SERVER STARTED"); 

await connectCloudinary();

// CORS
app.use(cors({
  origin: "https://useai-sigma.vercel.app",
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => {
  res.send("Server is Live");
});

app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

// 🔥 IMPORTANT FOR RENDER
export default app;

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}