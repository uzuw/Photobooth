// models/GalleryImage.ts
import mongoose from "mongoose";

// models/GalleryImage.ts
const GalleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The link!
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("GalleryImage", GalleryImageSchema);