const { Router } = require("express");
const { displayFolder } = require("../controllers/viewController");

const viewRouter = Router();

viewRouter.get("/{:folderId}", displayFolder);

// view parent folder
viewRouter.get("/", (req, res) => {});

module.exports = viewRouter;
