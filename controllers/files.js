import { prisma } from "../lib/prisma.js";
import { supabase } from "../lib/supabase.js";
import path from "path";

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
  const folderId = req.body.folderId ? parseInt(req.body.folderId) : null;
  await prisma.file.create({
    data: {
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      path: data.path,
      userId: req.user.id,
      folderId,
    },
  });

  res.redirect(folderId ? `/folders/${folderId}` : "/");
};

const showFile = async (req, res) => {
  const fileId = parseInt(req.params.id);
  const file = await prisma.file.findUnique({
    where: { id: fileId, userId: req.user.id },
  });
  res.render("file-detail", { file: file });
};

const downloadFile = async (req, res) => {
  const fileId = parseInt(req.params.id);
  const file = await prisma.file.findUnique({
    where: { id: fileId },
  });

  // const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${file.path}`;
  // res.redirect(fileUrl);

  const { data, error } = await supabase.storage
    .from("uploads")
    .download(file.path);

  if (error) return res.redirect("back");

  const buffer = Buffer.from(await data.arrayBuffer());

  res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
  res.setHeader("Content-Type", file.mimeType);
  res.send(buffer);
};

const deleteFile = async (req, res) => {
  const fileId = parseInt(req.params.id);
  const targetFile = await prisma.file.findUnique({
    where: { id: fileId, userId: req.user.id },
  });

  const { data, error } = await supabase.storage
    .from("uploads")
    .remove([`${targetFile.path}`]);

  if (error) {
    console.error(error);
    return res.redirect("back");
  }

  const { folderId } = targetFile;
  await prisma.file.delete({
    where: { id: fileId, userId: req.user.id },
  });

  res.redirect(folderId ? `/folders/${folderId}` : "/");
};

export default { listFiles, uploadFile, showFile, downloadFile, deleteFile };
