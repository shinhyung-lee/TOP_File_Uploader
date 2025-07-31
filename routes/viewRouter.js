const { Router } = require("express");

const viewRouter = Router();

viewRouter.get("/:folderName", (req, res) => {
  const folderName = req.params.folderName;
  res.json({ "msg": `folder router for ${folderName} opened` });
})

module.exports = viewRouter;