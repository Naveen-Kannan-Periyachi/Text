import express from "express";
import Feedback from "../models/Feedback.js";
import Document from "../models/Document.js";
import User from "../models/User.js";

const router = express.Router();

// Store feedback

// Simple in-memory rate limiter (per IP, 1/min)
const feedbackRateLimit = {};
router.post("/feedback", async (req, res) => {
  const { message, userId, rating } = req.body;
  const ip = req.ip;
  const now = Date.now();
  // Rate limit: 1 feedback per minute per IP
  if (feedbackRateLimit[ip] && now - feedbackRateLimit[ip] < 60000) {
    return res.status(429).json({ success: false, error: "Please wait before submitting again." });
  }
  feedbackRateLimit[ip] = now;
  // Input validation
  if (!message || typeof message !== "string" || message.trim().length < 5 || message.length > 1000) {
    return res.status(400).json({ success: false, error: "Feedback must be 5-1000 characters." });
  }
  // Sanitize message
  const sanitizedMessage = message.replace(/<[^>]*>?/gm, "").trim();
  try {
    const feedback = new Feedback({
      message: sanitizedMessage,
      user: userId || undefined,
      rating: rating || undefined,
      createdAt: new Date()
    });
    await feedback.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Store document upload
router.post("/document", async (req, res) => {
  const { filename, content, userId } = req.body;
  try {
    const doc = new Document({ filename, content, user: userId || undefined });
    await doc.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Store Google login user
router.post("/google-user", async (req, res) => {
  const { email, name } = req.body;
  try {
    console.log("Google signup/login request:", { email, name });
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, password: "" }); // Store name for Google users
      await user.save();
      console.log("Google user created:", user);
    } else if (!user.name && name) {
      user.name = name;
      await user.save();
      console.log("Google user name updated:", user);
    } else {
      console.log("Google user already exists:", user);
    }
    res.status(201).json({ user: { email: user.email, name: user.name }, id: user._id });
  } catch (err) {
    console.error("Google user creation error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
