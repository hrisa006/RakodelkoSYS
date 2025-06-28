import { Router } from "express";
import upload from "../middlewares/upload";
import { uploadMedia, getItemMedia } from "../controllers/mediaController";

const router = Router();

router.post("/", upload.single("image"), uploadMedia);
router.get("/:itemId", getItemMedia);

export default router;
