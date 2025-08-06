const { Router } = require("express");
const prisma = require("../config/prismaConfig");

const deleteRouter = Router();

// delete one file 
deleteRouter.delete("/{:fileId}/{:currentFolderId}", async (req, res, next) => {
  let currentFolderId;
  // could be null (root folder)
  if (typeof req.params.currentFolderId === "string") {
    currentFolderId = parseInt(req.params.currentFolderId);
  }
  console.log(`delete route. current folder: ${currentFolderId}`)  

  const fileIdToDelete = parseInt(req.params.fileId);
  try {
    const deletedFile = await prisma.file.delete({
      where: {
        id: fileIdToDelete,
      },
    });
    console.log(deletedFile);
  } catch (error) {
    console.error(error);
  }

  // redirect user
  let redirectUrl = "/";
  if (currentFolderId) {
    redirectUrl += `view/${currentFolderId}`;
  }
  console.log(`Delete completed. Redirect to ${redirectUrl}`);
  res.redirect(redirectUrl);
  return;
});

// delete folder (delete: Cascade)

module.exports = deleteRouter;
