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

  // 2. Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("uploads").getPublicUrl(data.path);

  // 3. Save metadata + URL to database
  await prisma.file.create({
    data: {
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      url: publicUrl,
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

const deleteFile = (_req, res) => {
  res.send("TODO: delete a file");
};

export default { listFiles, uploadFile, showFile, deleteFile };
