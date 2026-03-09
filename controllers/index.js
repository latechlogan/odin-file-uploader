import { prisma } from "../lib/prisma.js";

const homepage = async (req, res) => {
  if (req.user) {
    const search = req.query.search || "";
    const nameFilter = search
      ? { contains: search, mode: "insensitive" }
      : undefined;
    const files = await prisma.file.findMany({
      where: { userId: req.user.id, folderId: null, ...(nameFilter && { name: nameFilter }) },
    });
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id, ...(nameFilter && { name: nameFilter }) },
      orderBy: { createdAt: "asc" },
    });
    const error = req.query.error || null;
    res.render("index", { files, folders, search, error });
  } else {
    res.render("index", { files: [], folders: [], search: "", error: null });
  }
};

export default { homepage };
