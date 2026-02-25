import { Request, Response } from "express";
import GalleryImage from "../models/GalleryImage";
import cloudinary from "../config/cloudinary";
import mongoose from "mongoose";

interface AuthRequest extends Request{
  user?: {
    id: string;
    // Add other properties here if your JWT stores them (e.g., email: string)
  };
}


export const saveImage = async (req: AuthRequest, res: Response) => {
  const { photos, sessionId } = req.body;
  const userId = req.user?.id;

  try {
    // Process all images in the array (in your case, the 1 collage)
    const uploadPromises = photos.map((base64: string) =>
      cloudinary.uploader.upload(base64, {
        folder: `photobooth/${userId}`,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      })
    );

    const results = await Promise.all(uploadPromises);

    // Create database entries
    const dbEntries = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
      userId: userId,
      sessionId: sessionId,
    }));

    await GalleryImage.insertMany(dbEntries);

    res.status(201).json({ message: "Upload successful", data: dbEntries });
  } catch (error) {
    console.error("Cloudinary Error:", error);
    res.status(500).json({ message: "Error uploading to cloud storage" });
  }
};

export const getUserImages = async (req: Request, res: Response) => {
  const userId = (req as any).user.id; 

  try {
    const images = await GalleryImage.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your photos" });
  }
};

export const deleteImage = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 1. Find the image and ensure it belongs to the user
    const image = await GalleryImage.findOne({ _id: id, userId });

    if (!image) {
      return res.status(404).json({ message: "Image not found or unauthorized" });
    }

    // 2. Delete from Cloudinary using the stored publicId
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    // 3. Delete from MongoDB
    await GalleryImage.findByIdAndDelete(id);

    res.status(200).json({ message: "Memory deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};