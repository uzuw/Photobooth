import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// No need for cloudinary.config({...}) if the URL is in your .env!
export default cloudinary;