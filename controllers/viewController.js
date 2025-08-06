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
  console.log(`Current folder id: ${currentFolderId}`);

  const prevFolderId = res.locals.parentFolderId;

  console.log(`Prev folder id: ${prevFolderId}, Curr folder id: ${currentFolderId}`);
  // root folder
  // characteristics of folders that are in root folder? 
  // and the one below
  // will have children folders 
  if (currentFolderId === null) {
    let folders, files;
    try { 
      folders = await prisma.folder.findMany({
        where: {
          authorId: {
            equals: req.user.id,
          },
          parentFolderId: null,
        },
      });
      console.log(folders);
      files = await prisma.file.findMany({
        where: {
          authorId: {
            equals: req.user.id,
          },
          folderId: null,
        },
      });
      console.log(files);
      res.render("index", {
        user: req.user,
        folders: folders,
        files: files,
        currentFolderId: null,
        currentFolderName: null,
        parentFolderId: null,
        folderHierarchy: [ req.user.username, ],
      });
    } catch(err) {
      console.error(err);
    }

    // res.render does not end (req, res) cycle. we need to return
    return;
  }

  // Display subfolder (not root)
  let folder, childrenFiles, childrenFolders;
  let currentFolderName, parentFolderIdToCurrentFolder;
  try {
    folder = await prisma.folder.findUnique({
      where: {
        id: currentFolderId,
      },
      include: {
        files: true,
        parentFolder: true,
        childrenFolder: true,
      },
    });

    childrenFiles = await prisma.file.findMany({
      where: {
        folderId: currentFolderId,
      },
    })

    childrenFolders = await prisma.folder.findMany({
      where: {
        parentFolderId: currentFolderId,
      },
    });
    currentFolderName = folder.name;
    parentFolderIdToCurrentFolder = folder.parentFolderId;
    console.log(`parent folder id: ${parentFolderIdToCurrentFolder}`);

    res.render("index", {
      user: req.user,
      folders: childrenFolders,
      files: childrenFiles,
      currentFolderId: currentFolderId,
      currentFolderName: currentFolderName,
      parentFolderId: parentFolderIdToCurrentFolder,
    });
    return;
  } catch (err) {
    console.error(err);
  }
  // console.log(childrenFolders);
}

module.exports = {
  displayFolder,
}