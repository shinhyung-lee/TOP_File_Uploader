const { Router } = require("express");
const prisma = require("../config/prismaConfig");

const indexRouter = Router();

indexRouter.get("/", async (req, res) => {
  const sessions = await prisma.session.findMany();
  const folders = await prisma.folder.findMany({
    where: {
      authorId: {
        equals: req.user.id
      }
    }
  })
  console.log(folders);
  // console.log(sessions);
  res.render("index", { user: req.user });
});

module.exports = indexRouter;
