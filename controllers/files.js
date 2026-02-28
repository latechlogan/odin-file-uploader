import { prisma } from "../lib/prisma.js";

const listFiles = async (req, res) => {
  const files = await prisma.file.findMany({
    where: { userId: req.user.id },
  });
  res.render("files", { files: files });
};

const uploadFile = (_req, res) => {
  res.send("TODO: upload a file");
};

const showFile = (_req, res) => {
  res.send("TODO: show file details");
};

const deleteFile = (_req, res) => {
  res.send("TODO: delete a file");
};

export default { listFiles, uploadFile, showFile, deleteFile };
