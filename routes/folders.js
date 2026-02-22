import { Router } from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import foldersController from "../controllers/folders.js";

const router = Router();

router.get("/", isAuthenticated, foldersController.listFolders);
router.get("/new", isAuthenticated, foldersController.newFolderForm);
router.post("/", isAuthenticated, foldersController.createFolder);
router.get("/:id", isAuthenticated, foldersController.showFolder);
router.get("/:id/edit", isAuthenticated, foldersController.editFolderForm);
router.post("/:id/edit", isAuthenticated, foldersController.updateFolder);
router.post("/:id/delete", isAuthenticated, foldersController.deleteFolder);

export default router;
