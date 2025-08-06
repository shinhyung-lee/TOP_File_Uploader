const { Router } = require("express");
const prisma = require("../config/prismaConfig");
const multer = require("multer");
const fs = require("node:fs");
const path = require("node:path");
const { createFile } = require("../utils/query");

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

// from root
// filename, folderId: null
uploadRouter.post(
  "/file/{:folderId}",
  upload.single("userfile"),
  async (req, res, next) => {
    let currentFolderId = null;

    // if not root folder, req.params.folderId was supplied and it will be a string
    if (typeof req.params.folderId === "string") {
      currentFolderId = parseInt(req.params.folderId);
    }
    console.log(
      `Uploading file ${req.file.originalname} on folder id: ${currentFolderId}`
    );
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
    // changing kb to Mb
    const sizeInMegaByte = size / 1000000;
    const authorId = req.user.id;

    try {
      const newFile = createFile(
        currentFolderId,
        originalname,
        mimetype,
        sizeInMegaByte,
        path,
        authorId
      );
      // const newFile = await prisma.file.create({
      //   data: {
      //     title: originalname,
      //     mimetype: mimetype,
      //     size: sizeInMegaByte,
      //     path: path,
      //     author: {
      //       connect: {
      //         id: authorId,
      //       },
      //     },
      //     folder: (currentFolderId ? {
      //                 connect: {
      //                   id: currentFolderId,
      //                 }
      //               } : null
      //             ),
      //     // folder: {
      //     //   connect: {
      //     //     id: currentFolderId,
      //     //   }
      //     // }
      //   },
      // });
      console.log(newFile);

      let redirectUrl = "/";
      // error occurred because originally redirectUrl += `/view/...`;
      if (currentFolderId) {
        redirectUrl += `view/${currentFolderId}`;
      }
      console.log(`Redirecting to url: ${redirectUrl}`);
      res.redirect(redirectUrl);
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
  const parentFolderId = parseInt(req.params.currentFolderId);
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
        parentFolder: {
          connect: {
            id: parentFolderId,
          },
        },
      },
    });
    console.log(folder);
    let redirectUrl = "/";
    // error occurred because originally redirectUrl += `/view/...`;
    if (parentFolderId) {
      redirectUrl += `view/${parentFolderId}`;
    }
    res.redirect(redirectUrl);
  } catch (err) {
    return next(err);
  }

  // on our local file system
  // prolly not needed. Just using the mental model, not creating actual folder.
  // const folderPath = path.join(__dirname, "../uploads", folderName);
  // fs.mkdirSync(folderPath, { recursive: true }, (err) => {
  //   if (err) {
  //     console.error("Error creating directory:", err);
  //   }
  // });
});

module.exports = uploadRouter;
