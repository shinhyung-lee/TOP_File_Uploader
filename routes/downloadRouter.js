const { Router } = require("express");
const path = require("node:path");
const downloadRouter = Router();
const { downloadFile } = require("../controllers/downloadController");

downloadRouter.get("/:filename", downloadFile);

module.exports = downloadRouter;
