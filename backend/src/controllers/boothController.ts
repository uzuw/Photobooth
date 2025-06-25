import { Request, Response } from "express";
import BoothPhoto from "../models/BoothPhoto";

export const saveGalleryPhotos = async (req: Request, res: Response) => {
  try {
    const { photos, sessionId } = req.body;

    if (!photos || !Array.isArray(photos)) {
      return res.status(400).json({ message: "Photos array is required" });
    }

    const savedPhotos = await Promise.all(
      photos.map((base64: string) =>
        BoothPhoto.create({
          user: (req as any).user.id,
          imageData: base64,
          sessionId,
        })
      )
    );

    return res.status(201).json({ message: "Photos saved", savedPhotos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save photos" });
  }
};
