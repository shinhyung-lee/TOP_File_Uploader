const { Router } = require("express");
const prisma = require("../config/prismaConfig");
const indexRouter = Router();

// const deleteFiles = await prisma.file.deleteMany({})
// const deleteFolders = await prisma.folder.deleteMany({})

// const allFiles = await prisma.file.findMany({})
// const allFolders = await prisma.folder.findMany({})
// console.log(allFiles)
// console.log(allFolders)

// ONLY TRIGGERED with initial site visit. Needs to be refactored
// Todo
indexRouter.get("/", async (req, res) => {
  const sessions = await prisma.session.findMany();

  // tidy up or create a protected route
  if (req.user === undefined) {
    // user not defined, show login/signup page
    console.log(req.user);
    res.render("index");
    return;
  }
  // user is logged in
  const folders = await prisma.folder.findMany({
    where: {
      authorId: {
        equals: req.user.id,
      },
    },
  });
  const files = await prisma.file.findMany({
    where: {
      authorId: {
        equals: req.user.id,
      },
    },
  });

  res.render("index", {
    user: req.user,
    folders: folders,
    files: files,
    currentFolderId: null,
    currentFolderName: null,
    parentFolderId: null,
  });
});

module.exports = indexRouter;
