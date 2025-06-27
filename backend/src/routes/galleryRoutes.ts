import express from "express";
const saveImage = require("../controllers/galleyController").saveImage;
const getImages = require("../controllers/galleyController").getImages;
import authMiddleware from "../middlewares/authMiddleware"; // optional

const router = express.Router();

router.post("/", authMiddleware, saveImage); // or without authMiddleware
router.get("/", getImages);

export default router;
