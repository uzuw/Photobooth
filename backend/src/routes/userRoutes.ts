import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { updateUsername } from "../controllers/userController";
import { asyncHandler } from "../utils/asyncHandler";
import { updateProfilePic } from "../controllers/userController"; // Assuming this function is defined in userController

const router = express.Router();

router.put("/:id", authMiddleware, asyncHandler(updateUsername));


export default router;
