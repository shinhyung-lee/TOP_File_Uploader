const { create } = require("domain");
const prisma = require("../config/prismaConfig");

const createFile = async (currentFolderId, title, mimetype, size, path, authorId) => {
  let newFile;
  // not root folder
  if (currentFolderId) {
    newFile = await prisma.file.create({
                data: {
                  title: title,
                  mimetype: mimetype,
                  size: size,
                  path: path,
                  author: {
                    connect: {
                      id: authorId,
                    },
                  },
                  folder: {
                    connect: {
                      id: currentFolderId,
                    }
                  }
                },
        });
  } else { // root folder 
    newFile = await prisma.file.create({
                data: {
                  title: title,
                  mimetype: mimetype,
                  size: size,
                  path: path,
                  author: {
                    connect: {
                      id: authorId,
                    },
                  },
                },
              });
  }
  return newFile;
} 

module.exports = {
  createFile,
}