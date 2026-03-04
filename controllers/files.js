import { prisma } from "../lib/prisma.js";
import { supabase } from "../lib/supabase.js";

const listFiles = async (req, res) => {
  const files = await prisma.file.findMany({
    where: { userId: req.user.id },
  });
  res.render("files", { files: files });
};

const uploadFile = async (req, res) => {
  const file = req.file;

  // 1. Upload buffer to Supabase Storage
  const filePath = `${req.user.id}/${Date.now()}-${file.originalname}`;

  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) {
    console.error(error);
    return res.redirect("back");
  }

  // 2. Save metadata + storage path to database
  await prisma.file.create({
    data: {
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      path: data.path,
      userId: req.user.id,
      folderId: req.body.folderId ? parseInt(req.body.folderId) : null,
    },
  });

  res.redirect("/");
};

const showFile = async (req, res) => {
  const fileId = parseInt(req.params.id);
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });
  res.render("file-detail", { file: file });
};

const deleteFile = async (req, res) => {
  const fileId = parseInt(req.params.id);
  const targetFile = await prisma.file.findUnique({
    where: { id: fileId },
  });

  const { data, error } = await supabase.storage
    .from("uploads")
    .remove([`${targetFile.path}`]);

  if (error) {
    console.error(error);
    return res.redirect("back");
  }

  await prisma.file.delete({
    where: { id: fileId },
  });

  res.redirect("/files");
};

export default { listFiles, uploadFile, showFile, deleteFile };
