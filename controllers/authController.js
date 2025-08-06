const prisma = require("../config/prismaConfig");
const { supabase } = require("../config/supabaseConfig");

const createUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(`Username: ${username}`);
  // try {
  //   const user = await prisma.user.create({
  //     data: {
  //       username,
  //       password,
  //     },
  //   });
  //   console.log(user);
  //   res.redirect("/auth/login");
  // } catch (err) {
  //   return next(err);
  // }
  const { data, error } = await supabase.auth.signUp({
    username,
    password,
  });
  if (error) {
    console.error("Error signing up:", error.message);
  } else {
    console.log("User signed up successfully:", data.user);
  }
};

const userLogin = async (req, res, next) => {
  // placeholder for login
  res.json({ msg: "login successful" });
};

const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send("Error logging out.");
      }

      // Clear the session cookie from the client's browser
      // Replace 'connect.sid' with the actual name of your session cookie
      res.clearCookie("connect.sid");

      // Redirect the user to the login page or a confirmation page
      res.redirect("/");
    });
  });
};

module.exports = {
  createUser,
  userLogin,
  logOut,
};
