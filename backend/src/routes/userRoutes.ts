import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { updateUsername } from "../controllers/userController";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

router.put("/:id", authMiddleware, asyncHandler(updateUsername));

export default router;
