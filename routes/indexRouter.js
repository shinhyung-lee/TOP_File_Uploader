const { Router } = require("express");
const prisma = require("../config/prismaConfig");
const indexRouter = Router();

// const deleteFiles = await prisma.file.deleteMany({})
// const deleteFolders = await prisma.folder.deleteMany({})
// delete files and folders for Schema change

indexRouter.get("/", async (req, res) => {
  // const numByte = 306151;
  // const numMegaByte = numByte / 1000000;
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
  // if (files) {
  //   console.log(files);
  // }
  res.render("index", { user: req.user, folders: folders, files: files });
});

module.exports = indexRouter;
