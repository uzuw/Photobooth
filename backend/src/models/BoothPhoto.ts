import mongoose from "mongoose";

const boothPhotoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageData: { type: String, required: true }, // base64 or image URL
    sessionId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("BoothPhoto", boothPhotoSchema);
