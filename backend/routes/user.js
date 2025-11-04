// src/routes/user.js
import express from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.AWS_S3_BUCKET;

// POST /api/user/avatar/presign
router.post("/avatar/presign", requireAuth, async (req, res) => {
  try {
    // Expect mime type in body e.g. image/jpeg
    const { contentType } = req.body;
    if (!contentType)
      return res.status(400).json({ message: "contentType required" });

    // build key using F3: users/{userId}/profile/avatar-{timestamp}.jpg
    const ext = contentType.split("/")[1] || "jpg";
    const key = `users/${req.userId}/profile/avatar-${Date.now()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
      ACL: "public-read", // make file public (or handle access via CloudFront). If you want private, remove and adjust frontend.
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // 60s

    // public URL where the file will be served (depends on bucket settings)
    const publicUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.status(200).json({ uploadUrl, publicUrl, key });
  } catch (err) {
    console.error("Presign error:", err);
    res.status(500).json({ message: "Failed to create presigned url" });
  }
});

// POST /api/user/avatar (save final avatar url)
router.post("/avatar", requireAuth, async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    if (!avatarUrl)
      return res.status(400).json({ message: "avatarUrl required" });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { avatar: avatarUrl },
      { new: true, select: "_id name email avatar" }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res
      .status(200)
      .json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
  } catch (err) {
    console.error("Save avatar error:", err);
    res.status(500).json({ message: "Failed to save avatar" });
  }
});

export default router;
