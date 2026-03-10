import { prisma } from "../lib/prisma.js";

const homepage = async (req, res) => {
  if (req.user) {
    const search = req.query.search || "";
    const nameFilter = search
      ? { contains: search, mode: "insensitive" }
      : undefined;
    const files = await prisma.file.findMany({
      where: {
        userId: req.user.id,
        folderId: null,
        ...(nameFilter && { name: nameFilter }),
      },
      orderBy: {
        name: "asc",
      },
    });
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id, ...(nameFilter && { name: nameFilter }) },
      orderBy: { name: "asc" },
    });
    const error = req.query.error || null;
    const viewMode = req.query.view === 'combined' ? 'combined' : 'separate';
    res.render("index", {
      pageContext: "index",
      files,
      folders,
      search,
      error,
      viewMode,
      supabaseUrl: process.env.SUPABASE_URL,
    });
  } else {
    res.render("index", {
      pageContext: "index",
      files: [],
      folders: [],
      search: "",
      error: null,
    });
  }
};

export default { homepage };
