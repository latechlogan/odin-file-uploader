import { prisma } from "../lib/prisma.js";

const listFolders = async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "asc" },
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
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });
  res.render("folder-detail", { folder });
};

const editFolderForm = async (req, res) => {
  const folderId = parseInt(req.params.id);
  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  });
  res.render("edit-folder", { folder });
};

const updateFolder = async (req, res) => {
  const folderId = parseInt(req.params.id);
  const { folderName } = req.body;
  await prisma.folder.update({
    where: { id: folderId },
    data: { name: folderName },
  });
  res.redirect(`/folders/${folderId}`);
};

const deleteFolder = async (req, res) => {
  const folderId = parseInt(req.params.id);
  const deleted = await prisma.folder.delete({
    where: { id: folderId },
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
