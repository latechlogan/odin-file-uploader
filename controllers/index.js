import { prisma } from "../lib/prisma.js";

const homepage = async (req, res) => {
  const user = req.user || null;
  const { search = "", type = "all" } = req.query;

  if (user) {
    const files = await prisma.file.findMany({ where: { userId: user.id } });
    const folders = await prisma.folder.findMany({
      where: { userId: user.id },
    });
    res.render("index", { user, search, type, files, folders });
  } else {
    res.render("index", { user, search, type, files: [], folders: [] });
  }
};

export default { homepage };
