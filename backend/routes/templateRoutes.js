import express from "express";
import Template from "../models/Template.js";
import requireAuth from "../middleware/requireAuth.js"; // use the correct import

const router = express.Router();

// Get all templates for the logged-in user
router.get("/", requireAuth, async (req, res) => {
  try {
    const templates = await Template.find({ user: req.userId }); // req.userId set by requireAuth
    res.status(200).json(templates);
  } catch (err) {
    console.error("Fetch Templates Error:", err);
    res.status(500).json({ message: "Server error." });
  }
});

// Add new template
router.post("/", requireAuth, async (req, res) => {
  const { category, title, body } = req.body;
  try {
    const newTemplate = new Template({ user: req.userId, category, title, body });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update template
router.put("/:id", requireAuth, async (req, res) => {
  const { title, body, category } = req.body;
  try {
    const updatedTemplate = await Template.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, body, category },
      { new: true }
    );
    res.json(updatedTemplate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete template
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    await Template.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: "Template deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



export default router;
