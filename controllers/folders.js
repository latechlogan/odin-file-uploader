import { prisma } from "../lib/prisma.js";

const listFolders = async (_req, res) => {
  const folders = await prisma.folder.findMany({
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

const deleteFolder = (_req, res) => {
  res.send("TODO: delete a folder");
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
