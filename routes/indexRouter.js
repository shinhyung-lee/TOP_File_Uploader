const { Router } = require("express");
const prisma = require("../config/prismaConfig");
const { formattedDateTime } = require("../utils/utils");

const indexRouter = Router();

// const deleteFiles = await prisma.file.deleteMany({})
// const deleteFolders = await prisma.folder.deleteMany({})
// delete files and folders for Schema change

indexRouter.get("/", async (req, res) => {
  const numByte = 306151;
  const numMegaByte = numByte / 1000000;
  // console.log(numMegaByte);
  const sessions = await prisma.session.findMany();

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

  // const utcTime = files[2].createdAt;
  // const estTime = utcTime.toLocaleString("en-US", {timeZone: "America/New_York", hourCycle: 'h23'});
  // formattedDateTime(estTime);

  // console.log(folders);
  // console.log(sessions);
});

module.exports = indexRouter;
