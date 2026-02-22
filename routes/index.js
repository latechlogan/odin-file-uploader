import { Router } from "express";
import indexController from "../controllers/index.js";

const router = Router();

router.get("/", indexController.homepage);

export default router;
