import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { updateUsername } from "../controllers/userController";
import { asyncHandler } from "../utils/asyncHandler";
import { updateProfilePic } from "../controllers/userController"; // Assuming this function is defined in userController
import { getStats } from "../controllers/userController";

const router = express.Router();

router.put("/:id", authMiddleware, asyncHandler(updateUsername));
router.get("/stats",authMiddleware,getStats)

export default router;
