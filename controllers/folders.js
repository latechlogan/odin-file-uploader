import { prisma } from "../lib/prisma.js";
import { supabase } from "../lib/supabase.js";

const listFolders = async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
    orderBy: { name: "asc" },
  });
  res.render("folders", { folders });
};

const newFolderForm = (_req, res) => {
  res.render("new-folder");
};

const createFolder = async (req, res) => {
  const { folderName } = req.body;
  await prisma.folder.create({
    data: {
      name: folderName,
      userId: req.user.id,
    },
  });
  res.redirect("/folders");
};

const showFolder = async (req, res) => {
  const folderId = parseInt(req.params.id);
  const search = req.query.search || "";
  const error = req.query.error || null;
  const folder = await prisma.folder.findUnique({
    where: { id: folderId, userId: req.user.id },
  });
  if (!folder) return res.status(404).send("Folder not found.");
  const files = await prisma.file.findMany({
    where: {
      folderId,
      userId: req.user.id,
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    },
  });
  res.render("folder-detail", {
    pageContext: "folder",
    folder,
    files,
    search,
    error,
  });
};

const editFolderForm = async (req, res) => {
  const folderId = parseInt(req.params.id);
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
      userId: req.user.id,
    },
  });
  if (!folder) return res.status(404).send("Folder not found.");
  res.render("edit-folder", { folder });
};

const updateFolder = async (req, res) => {
  const folderId = parseInt(req.params.id);
  const { folderName } = req.body;
  await prisma.folder.update({
    where: { id: folderId, userId: req.user.id },
    data: { name: folderName },
  });
  res.redirect(`/folders/${folderId}`);
};

const deleteFolder = async (req, res) => {
  const folderId = parseInt(req.params.id);
  const files = await prisma.file.findMany({
    where: {
      folderId,
      userId: req.user.id,
    },
  });

  await Promise.all(
    files.map((file) => supabase.storage.from("uploads").remove([file.path])),
  );

  await prisma.folder.delete({
    where: { id: folderId, userId: req.user.id },
  });
  res.redirect("/folders");
};

export default {
  listFolders,
  newFolderForm,
  createFolder,
  showFolder,
  editFolderForm,
  updateFolder,
  deleteFolder,
};
