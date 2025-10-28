import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    profileLink: {
      type: String,
      trim: true,
    },
    lastMessage: {
      type: String,
      trim: true,
    },
    nextFollowUpDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Follow Up", "Pending", "Done"],
      default: "Follow Up",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);