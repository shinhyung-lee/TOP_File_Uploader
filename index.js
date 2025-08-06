const dotenv = require('dotenv')
const express = require("express");
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const uploadRouter = require("./routes/uploadRouter");
const downloadRouter = require("./routes/downloadRouter");
const viewRouter = require("./routes/viewRouter");
const deleteRouter = require("./routes/deleteRouter");
const session = require("express-session");
const { prismaSessionOption } = require("./config/prismaSessionConfig");
const methodOverride = require('method-override');
const { createBucketIfNotExists, checkIfAuthenticated } = require("./config/supabaseConfig");

dotenv.config();
// Take note: we aren't using just the default definition
// const passport = require("passport");
const passport = require("./config/passportConfig");

const app = express();
const port = process.env.PORT || 4000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// html forms only allow GET and POST, need to use method-override middleware to use DELETE method
app.use(methodOverride('_method'))
app.use(session(prismaSessionOption));

// check SUPABASE status 
// checkIfAuthenticated();
// createBucketIfNotExists("files");

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/download", downloadRouter);
app.use("/view", viewRouter);
app.use("/delete", deleteRouter);
app.use("/", indexRouter);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// "/upload/folder/:parentFolderId?"