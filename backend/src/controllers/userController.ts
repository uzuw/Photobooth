import { Request, Response } from "express";
import User from "../models/User";

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
