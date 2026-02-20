import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";

const registerGet = (req, res) => {
  res.render("register", { error: null });
};

const registerPost = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    await prisma.user.create({
      data: { username, email, passwordHash: await bcrypt.hash(password, 10) },
    });
    res.redirect("/login");
  } catch (err) {
    if (err.code === "P2002") {
      return res.render("register", {
        error: "Username or email already taken.",
      });
    }
    next(err);
  }
};

const loginGet = (req, res) => {
  const messages = req.session.messages || [];
  req.session.messages = [];
  res.render("login", { error: messages[messages.length - 1] ?? null });
};

const logoutPost = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};

export default { registerGet, registerPost, loginGet, logoutPost };
