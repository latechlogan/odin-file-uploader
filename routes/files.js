import { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import filesController from "../controllers/files.js";

const router = Router();

router.get("/", isAuthenticated, filesController.listFiles);
router.post("/upload", isAuthenticated, filesController.uploadFile);
router.get("/:id", isAuthenticated, filesController.showFile);
router.post("/:id/delete", isAuthenticated, filesController.deleteFile);

export default router;
