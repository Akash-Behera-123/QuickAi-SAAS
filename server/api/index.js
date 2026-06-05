import app from "../server.js";

// IMPORTANT: wrap to ensure middleware runs correctly in Vercel
export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://useai-sigma.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return app(req, res);
}