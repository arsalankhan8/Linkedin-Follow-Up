import mongoose from "mongoose";

const templateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Template", templateSchema);
