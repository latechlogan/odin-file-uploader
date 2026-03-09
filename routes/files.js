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
  (err, req, res, next) => {
    if (err) {
      let message = "Upload failed.";
      if (err.code === "LIMIT_FILE_SIZE") message = "File exceeds the 5MB limit.";
      else if (err.message === "File type not allowed") message = "File type not allowed. Accepted: JPEG, PNG, GIF, WebP, PDF.";
      const back = req.get("Referrer") || "/";
      const separator = back.includes("?") ? "&" : "?";
      return res.redirect(`${back}${separator}error=${encodeURIComponent(message)}`);
    }
    next();
  },
  filesController.uploadFile,
);
router.get("/:id", isAuthenticated, filesController.showFile);
router.get("/:id/download", isAuthenticated, filesController.downloadFile);
router.post("/:id/delete", isAuthenticated, filesController.deleteFile);

export default router;
