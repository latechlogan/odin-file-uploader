import { Router } from "express";
import passport from "passport";
import authController from "../controllers/auth.js";

const router = Router();

router.get("/register", authController.registerGet);
router.post("/register", authController.registerPost);

router.get("/login", authController.loginGet);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  }),
);

router.post("/logout", authController.logoutPost);

export default router;
