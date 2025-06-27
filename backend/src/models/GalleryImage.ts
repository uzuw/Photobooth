import mongoose, { Schema } from "mongoose";

const galleryImageSchema = new Schema(
  {
    image: { type: String, required: true }, // base64 string
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("GalleryImage", galleryImageSchema);
