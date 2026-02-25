import { Request, Response } from "express";
import User from "../models/User";
import GalleryImage from "../models/GalleryImage";


import mongoose from "mongoose";
export const updateUsername = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    const user = await User.findByIdAndUpdate(id, { username }, { new: true });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Username updated", username});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

import { AuthRequest } from "../middlewares/authMiddleware";

// PUT /api/users/profile-pic
export const updateProfilePic = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;
    const { profilePic } = req.body;

    if (!userId || !profilePic) {
      return res.status(400).json({ message: "Missing user ID or image data" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Update Profile Pic Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    // Aggregation: Group by date and count
    const stats = await GalleryImage.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(stats); // Returns [{ _id: "2024-05-01", count: 4 }, ...]
  } catch (error) {
    res.status(500).json({ message: "Error fetching heatmap stats" });
  }
};