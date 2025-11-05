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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Count total for this user
    const totalCount = await Contact.countDocuments({ userId: req.userId });

    // Pull only this page's contacts
    const contacts = await Contact.find({ userId: req.userId })
      .sort({ nextFollowUpDate: 1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      contacts,
      totalPages,
      totalCount,
    });

  } catch (err) {
    console.error("Fetch Contacts Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE CONTACT
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!contact) return res.status(404).json({ message: "Contact not found" });

    res.json({ message: "Contact updated", contact });
  } catch (err) {
    console.error("Update Contact Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
