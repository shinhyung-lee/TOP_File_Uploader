const { Router } = require("express");
const prisma = require("../config/prismaConfig");
const multer = require("multer");
const { formattedDateTime } = require("../utils/utils");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, 'C:/Users/mes/Desktop/multer_storage')
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadRouter = Router();

uploadRouter.get("/file", (req, res) => {
  res.json({ msg: "file upload GET reached" });
});

uploadRouter.post(
  "/file",
  upload.single("userfile"),
  async (req, res, next) => {
    // Todo
    // console.log(req.file);
    console.log(req.file.originalname);
    //   model File {
    //   id        Int      @id @default(autoincrement())
    //   createdAt DateTime @default(now())
    //   updatedAt DateTime @updatedAt
    //   title     String   @db.VarChar(255)
    //   content   String?
    //   size      Int
    //   mimetype  String   @db.VarChar(255)
    //   path      String   @db.VarChar(255)
    //   author    User     @relation(fields: [authorId], references: [id])
    //   authorId  Int
    //   folder    Folder?  @relation(fields: [folderId], references: [id])
    //   folderId  Int?
    // }
    // folder? use req.params.folderId
    const { originalname, mimetype, path, size } = req.file;
    // const customFormattedTime = formattedDateTime(req.file.createdAt);
    const sizeInMegaByte = size / 1000000;
    const authorId = req.user.id;
    // insert file into db (prisma)
    try {
      const newFile = await prisma.file.create({
        data: {
          title: originalname,
          mimetype: mimetype,
          size: sizeInMegaByte,
          path: path,
          // formattedTime: customFormattedTime,
          author: {
            connect: {
              id: authorId,
            },
          },
        },
      });
      console.log(newFile);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }
);

// add folder to prisma
uploadRouter.post("/folder", async (req, res, next) => {
  const name = req.body.folder_name;
  try {
    const folder = await prisma.folder.create({
      data: {
        name: name,
        author: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });
    console.log(folder);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
});

module.exports = uploadRouter;
