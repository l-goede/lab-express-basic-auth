const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require("bcryptjs");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  UserModel.create({ username, password: hash });
  then(() => {
    res.redirect("/");
  }).catch((err) => {
    next(err);
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.get("/logout", (req, res, next) => {
  res.render("auth/logout.hbs");
});
