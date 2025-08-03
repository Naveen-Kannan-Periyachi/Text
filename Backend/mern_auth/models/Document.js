import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Document", documentSchema);
