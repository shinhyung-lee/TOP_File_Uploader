const { Router } = require("express");
const { downloadFile } = require("../controllers/downloadController");

const downloadRouter = Router();

downloadRouter.get("/:filename", downloadFile);

module.exports = downloadRouter;
