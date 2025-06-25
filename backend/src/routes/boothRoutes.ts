import express from "express";
import { saveGalleryPhotos } from "../controllers/boothController";
import authMiddleware from "../middlewares/authMiddleware"

const router = express.Router();
router.post("/save", authMiddleware, saveGalleryPhotos);

export default router;
