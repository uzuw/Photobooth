import express from "express";
// 1. Use import instead of require
// 2. Check the spelling: "gallery" vs "galley"
import { saveImage,getUserImages } from "../controllers/galleyController";
import authMiddleware from "../middlewares/authMiddleware";
import { validateBoothPhotos } from "../middlewares/boothMiddleware";
import { deleteImage } from "../controllers/galleyController";

const router = express.Router();

// Now these variables will definitely be functions
router.post("/save",authMiddleware,validateBoothPhotos, saveImage,); 

router.get("/",authMiddleware, getUserImages); 

router.delete("/:id", authMiddleware, deleteImage);

router.get("/stats",authMiddleware); 
export default router;

const health =(req:any,res:any)=>{
    res.json({
        message:"gallery route working"
    })
}

router.get("/",health);