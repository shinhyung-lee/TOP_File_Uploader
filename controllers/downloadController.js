const path = require("node:path");

const downloadFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../uploads", filename); // Construct the full path to the file

  res.download(filePath, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      // handle error gracefully, not like the below
      res.status(500).send("Error downloading file.");
    }
  });
  // console.log(filePath);
  // res.redirect("/");
}

module.exports = {
  downloadFile,
}