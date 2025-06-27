import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  profilePic?: string; // Optional field
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" }, // base64 string or image URL
});

export default mongoose.model<IUser>("User", userSchema);
