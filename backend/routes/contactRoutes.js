import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import Contact from "../models/Contact.js";

const router = express.Router();

// CREATE CONTACT
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, company, role, profileLink, lastMessage, nextFollowUpDate, status } = req.body;

    const contact = await Contact.create({
      name,
      company,
      role,
      profileLink,
      lastMessage,
      nextFollowUpDate, // this MUST be ISO in frontend before sending
      status,
      userId: req.userId
    });

    res.status(201).json({ message: "Contact created", contact });
  } catch (err) {
    console.error("Create Contact Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all contacts for the logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ contacts });
  } catch (err) {
    console.error("Fetch Contacts Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
