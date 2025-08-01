const prisma = require("../config/prismaConfig");

// API endpoint: /view/{:folderId}
// root folder: /view/null or /view/?
// subfolders: /view/folderId
const displayFolder = async (req, res, next) => {
  // currentFolderId: folder that needs to be displayed
  let currentFolderId = null;

  // if not root folder, req.params.folderId was supplied and it will be a string
  if (typeof req.params.folderId === "string") {
    currentFolderId = parseInt(req.params.folderId);
  }

  // root folder
  if (currentFolderId === null) {
    const folders = await prisma.folder.findMany({
      where: {
        authorId: {
          equals: req.user.id,
        },
        parentFolderId: null,
      },
    });
    const files = await prisma.file.findMany({
      where: {
        authorId: {
          equals: req.user.id,
        },
        folderId: null,
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
    // res.render does not end (req, res) cycle. we need to return
    return;
  }

  // subfolder 
  const folder = await prisma.folder.findUnique({
    where: {
      id: currentFolderId,
    },
    include: {
      files: true,
      parentFolder: true,
      childrenFolder: true,
    },
  });
  const currentFolderName = folder.name;
  const parentFolderIdToCurrentFolder = folder.parentFolderId;

  console.log(`parent folder id: ${parentFolderIdToCurrentFolder}`);

  const childrenFiles = await prisma.file.findMany({
    where: {
      folderId: currentFolderId,
    },
  })
  const childrenFolders = await prisma.folder.findMany({
    where: {
      parentFolderId: currentFolderId,
    },
  });

  // console.log(childrenFiles);
  // console.log(childrenFolders);
  res.render("index", {
    user: req.user,
    folders: childrenFolders,
    files: childrenFiles,
    currentFolderId: currentFolderId,
    currentFolderName: currentFolderName,
    parentFolderId: parentFolderIdToCurrentFolder,
  });
}

module.exports = {
  displayFolder,
}