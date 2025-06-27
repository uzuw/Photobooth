import express from "express";
import { updateProfilePic } from "../controllers/userController"; // Assuming this function is defined in userControlle
import authMiddleware from "../middlewares/authMiddleware"; // optional

const router = express.Router();


router.put("/profile-pic", authMiddleware,updateProfilePic);

export default router;