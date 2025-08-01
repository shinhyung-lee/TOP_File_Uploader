const { Router } = require("express");
const prisma = require("../config/prismaConfig");
const multer = require("multer");
const fs = require("node:fs");
const path = require("node:path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const uploadRouter = Router();

uploadRouter.post(
  "/file",
  upload.single("userfile"),
  async (req, res, next) => {
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

// DO NOT HAVE TO create folder in the folder/file hierarchy
// mental model is there, but we can reference them using parentId, childId, currentId
uploadRouter.post("/folder/{:currentFolderId}", async (req, res, next) => {
  const folderName = req.body.folder_name;
  // req.params.currentFolderId becomes parent folderId
  // because we are creating a child folder INSIDE OF the parent folder
  const parentFolderId = req.params.currentFolderId;
  console.log(`parent folder id is: ${parentFolderId}`);
  // prisma side
  try {
    const folder = await prisma.folder.create({
      data: {
        name: folderName,
        author: {
          connect: {
            id: req.user.id,
          },
        },
        parentFolderId: parentFolderId,
      },
    });
    console.log(folder);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }

  // on our local file system
  // prolly not needed. Just using the mental model, not creating actual folder. 
  const folderPath = path.join(__dirname, "../uploads", folderName);
  fs.mkdirSync(folderPath, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating directory:", err);
    }
  });
});

module.exports = uploadRouter;
