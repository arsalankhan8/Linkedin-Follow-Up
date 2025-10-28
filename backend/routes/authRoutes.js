import express from "express";
import User from "../models/User.js";
import {
  loginLimiter,
  otpLimiter,
  forgotPasswordLimiter,
} from "../utils/rateLimiter.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

// Temporary in-memory store for OTPs (replace with Redis in production)
const otpStore = new Map();

// Helper: Generate 6-digit OTP

function generateNumericOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// Google login route

router.post("/google-login", async (req, res) => {
  try {
    const { tokenId } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, googleId, isVerified: true });
      await user.save();
    }

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.json({
      user: { id: user._id, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Google login failed." });
  }
});

// register user route

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!password || password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters." });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered." });

    // Generate OTP
    const otp = generateNumericOTP();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expires = Date.now() + 1000 * 60 * 10; // 10 minutes

    // Store OTP + user data temporarily
    otpStore.set(email, {
      otpHash,
      expires,
      userData: { name, email, password },
    });

    // Send OTP
    await sendEmail(
      email,
      "Verify Your Email - LinkedIn Follow-up",
      `
        <h2>Welcome to LinkedIn Follow-up!</h2>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>Please verify your email to complete registration.</p>
        <p>This OTP expires in 10 minutes.</p>
      `
    );

    res.status(200).json({
      message: "OTP sent! Please verify your email to complete registration.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// resend otp route

router.post("/resend-otp", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    const record = otpStore.get(email);
    if (!record)
      return res
        .status(400)
        .json({ message: "No pending registration found for this email." });

    const { userData } = record;

    // Generate new OTP
    const otp = generateNumericOTP();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expires = Date.now() + 1000 * 60 * 10;

    otpStore.set(email, { otpHash, expires, userData });

    // Send new OTP email
    await sendEmail(
      email,
      "Resend OTP - LinkedIn Follow-up",
      `
        <h2>LinkedIn Follow-up</h2>
        <p>Your new OTP is: <b>${otp}</b></p>
        <p>This OTP expires in 10 minutes.</p>
      `
    );

    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// verify otp route

router.post("/verify-otp", otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const record = otpStore.get(email);
    if (!record)
      return res.status(400).json({ message: "No OTP found or expired." });

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (record.otpHash !== hashedOtp)
      return res.status(400).json({ message: "Invalid OTP." });

    if (Date.now() > record.expires)
      return res.status(400).json({ message: "OTP expired." });

    const { name, password } = record.userData;
    const user = new User({ name, email, password, isVerified: true });
    await user.save();

    otpStore.delete(email);

    res
      .status(201)
      .json({ message: "Email verified and account created successfully." });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// login route

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in." });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials." });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(200).json({
      user: { id: user._id, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error." });
  }
});


// refresh token route

router.post("/refresh", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(401).json({ message: "Refresh token required." });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.userId);

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired refresh token." });
  }
});


// forgot password route

router.post("/forgot-password", forgotPasswordLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "No account found with that email." });

    // 2️⃣ Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Store hash & expiry on user (not the raw token)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    // 3️⃣ Build reset link (frontend route)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 4️⃣ Send email
    await sendEmail(
      user.email,
      "Password Reset - LinkedIn Follow-up",
      `
        <h2>Reset Your Password</h2>
        <p>We received a request to reset your password.</p>
        <p>Click the link below to set a new password (expires in 15 minutes):</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      `
    );

    // 5️⃣ Respond
    res.status(200).json({
      message: "Password reset link sent to your email.",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "Failed to send reset link." });
  }
});

// reset password route

// reset password route (query-based)

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Token and password are required." });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired reset token." });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error." });
  }
});



export default router;
