const { Router } = require("express");
const { createUser, userLogin, logOut } = require("../controllers/authController");
const passport = require("passport");

const authRouter = Router();

authRouter.get("/login", (req, res) => {
  res.render("login", { message: "User login" });
});

authRouter.get("/signup", (req, res) => {
  res.render("signup", { message: "Signup" });
});

// placeholder function
authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/signup",
  })
);
authRouter.post("/signup", createUser);
authRouter.post("/logout", logOut);

module.exports = authRouter;
