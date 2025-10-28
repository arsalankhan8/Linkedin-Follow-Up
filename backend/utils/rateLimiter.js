import rateLimit from "express-rate-limit";

const isLocal =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local";

function maybeRateLimit(options) {
  if (isLocal) return (req, res, next) => next(); // No rate limit locally
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    ...options,
  });
}

export const loginLimiter = maybeRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

export const otpLimiter = maybeRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many OTP requests, try again later.",
  },
});

export const forgotPasswordLimiter = maybeRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: "Too many password reset requests, try again later.",
  },
});
