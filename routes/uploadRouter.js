const { Router } = require("express");
const prisma = require("../config/prismaConfig");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, 'C:/Users/mes/Desktop/multer_storage')
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });

const uploadRouter = Router();

uploadRouter.get("/file", (req, res) => {
  res.json({ msg: "file upload GET reached" })
});

uploadRouter.post("/file", upload.single('userfile'), (req, res, next) => {
  // Todo
  console.log(req.file);
  console.log(req.file.originalname);
  res.redirect("/");
}); 

// add folder to prisma
uploadRouter.post("/folder", async (req, res, next) => {
  const name = req.body.folder_name;
  try {
    const folder = await prisma.folder.create({
      data: {
        name: name,
        author: {
          connect: {
            id: req.user.id
          }
        }
      }
    })
    console.log(folder);
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
})

module.exports = uploadRouter;
