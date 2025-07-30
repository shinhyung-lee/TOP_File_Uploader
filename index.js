const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const uploadRouter = require("./routes/uploadRouter");
const downloadRouter = require("./routes/downloadRouter");
const session = require("express-session");
const { prismaSessionOption } = require("./config/prismaSessionConfig");

// TAKE NOTE we aren't using just the default definition
// const passport = require("passport");
const passport = require("./config/passportConfig");

const app = express();
const port = process.env.PORT || 4000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session(prismaSessionOption));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/assets'));

app.use("/auth", authRouter);
app.use("/", indexRouter);
app.use("/upload", uploadRouter);
app.use("/download", downloadRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
