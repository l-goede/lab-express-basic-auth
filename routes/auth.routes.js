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
  UserModel.create({ username, password: hash })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  UserModel.find({ username })
    .then((userData) => {
      if (userData.length) {
        let userObj = userData[0];
        let match = bcrypt.compareSync(password, userObj.password);
        if (match) {
          req.session.myProperty = userObj;
          res.redirect("/private");
        } else {
          res.render("auth/login.hbs", {
            error: "Your Password is wrong. Think twice and try again.",
          });
          return;
        }
      } else {
        res.render("auth/login.hbs", {
          error: "Either you typed your own name wrong or you don not exist.",
        });
        return;
      }
    })
    .catch((err) => {
      next(err);
    });
});

const checkLogin = (req, res, next) => {
  if (req.session.myProperty) {
    //invokes the next available function
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/private", checkLogin, (req, res, next) => {
  let loggedInUser = req.session.myProperty;
  res.render("auth/private.hbs", { name: loggedInUser.username });
});

router.get("/main", checkLogin, (req, res, next) => {
  res.render("auth/main.hbs");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("login");
});

module.exports = router;
