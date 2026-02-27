import { prisma } from "../lib/prisma.js";

const homepage = async (req, res) => {
  if (req.user) {
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
    });
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "asc" },
    });
    res.render("index", { files, folders });
  } else {
    res.render("index", { files: [], folders: [] });
  }
};

export default { homepage };
