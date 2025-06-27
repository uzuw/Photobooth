import { Request, Response } from "express";
import GalleryImage from "../models/GalleryImage";

export const saveImage = async (req: Request, res: Response) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ message: "Image is required" });

  try {
    const saved = await GalleryImage.create({ image });
    res.status(201).json(saved);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ message: "Failed to save image" });
  }
};

export const getImages = async (_: Request, res: Response) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });
    res.status(200).json(images);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch images" });
  }
};
