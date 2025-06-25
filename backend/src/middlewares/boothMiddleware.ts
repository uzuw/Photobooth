import { Request, Response, NextFunction } from "express";

export const validateBoothPhotos = (req: Request, res: Response, next: NextFunction) => {
  const { photos, sessionId } = req.body;

  if (!sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ message: "Invalid or missing sessionId." });
  }

  if (!Array.isArray(photos) || photos.length === 0) {
    return res.status(400).json({ message: "Photos must be a non-empty array." });
  }

  const invalidPhotos = photos.filter(
    (photo) => typeof photo !== "string" || !photo.startsWith("data:image/")
  );

  if (invalidPhotos.length > 0) {
    return res.status(400).json({ message: "One or more photos are not valid base64 images." });
  }

  next();
};
