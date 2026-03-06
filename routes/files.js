import { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import upload from "../middleware/upload.js";
import filesController from "../controllers/files.js";

const router = Router();

router.get("/", isAuthenticated, filesController.listFiles);
router.post(
  "/upload",
  isAuthenticated,
  upload.single("file"),
  filesController.uploadFile,
);
router.get("/:id", isAuthenticated, filesController.showFile);
router.get("/:id/download", isAuthenticated, filesController.downloadFile);
router.post("/:id/delete", isAuthenticated, filesController.deleteFile);

export default router;
