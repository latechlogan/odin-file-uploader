import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  // Clean up existing data in dependency order
  await prisma.shareLink.deleteMany();
  await prisma.file.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  // Create two users
  const alice = await prisma.user.create({
    data: {
      username: "alice",
      email: "alice@example.com",
      passwordHash,
    },
  });

  const bob = await prisma.user.create({
    data: {
      username: "bob",
      email: "bob@example.com",
      passwordHash,
    },
  });

  // Alice's folders
  const alicePhotos = await prisma.folder.create({
    data: { name: "Photos", userId: alice.id },
  });

  const aliceDocs = await prisma.folder.create({
    data: { name: "Documents", userId: alice.id },
  });

  // Bob's folder
  const bobProjects = await prisma.folder.create({
    data: { name: "Projects", userId: bob.id },
  });

  // Alice's files
  await prisma.file.createMany({
    data: [
      {
        name: "vacation.jpg",
        size: 2048000,
        mimeType: "image/jpeg",
        url: "https://example.com/uploads/vacation.jpg",
        userId: alice.id,
        folderId: alicePhotos.id,
      },
      {
        name: "portrait.png",
        size: 512000,
        mimeType: "image/png",
        url: "https://example.com/uploads/portrait.png",
        userId: alice.id,
        folderId: alicePhotos.id,
      },
      {
        name: "resume.pdf",
        size: 102400,
        mimeType: "application/pdf",
        url: "https://example.com/uploads/resume.pdf",
        userId: alice.id,
        folderId: aliceDocs.id,
      },
      {
        name: "notes.txt",
        size: 4096,
        mimeType: "text/plain",
        url: "https://example.com/uploads/notes.txt",
        userId: alice.id,
        folderId: null, // root-level file (no folder)
      },
    ],
  });

  // Bob's files
  await prisma.file.createMany({
    data: [
      {
        name: "app.js",
        size: 8192,
        mimeType: "application/javascript",
        url: "https://example.com/uploads/app.js",
        userId: bob.id,
        folderId: bobProjects.id,
      },
      {
        name: "readme.md",
        size: 2048,
        mimeType: "text/markdown",
        url: "https://example.com/uploads/readme.md",
        userId: bob.id,
        folderId: bobProjects.id,
      },
    ],
  });

  // Share links for Alice's Photos folder (one active, one expired)
  await prisma.shareLink.createMany({
    data: [
      {
        folderId: alicePhotos.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
      {
        folderId: alicePhotos.id,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // expired yesterday
      },
    ],
  });

  // Share link for Bob's Projects folder
  await prisma.shareLink.create({
    data: {
      folderId: bobProjects.id,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
  });

  console.log("Seed complete.");
  console.log("  Users: alice, bob (password: password123)");
  console.log("  Folders: Photos, Documents (alice) | Projects (bob)");
  console.log("  Files: 4 for alice, 2 for bob");
  console.log("  ShareLinks: 2 for Photos (1 expired), 1 for Projects");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
