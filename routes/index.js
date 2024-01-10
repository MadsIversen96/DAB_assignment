var express = require('express');
var router = express.Router();
const passport = require("passport");
var db = require('../models');
const { QueryTypes } = require('sequelize');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/login', function (req, res, next) {
  res.render("login", { title: "Express", user: req.user});
});

router.post("/login/password", function (req, res, next) {
  passport.authenticate("local", function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) { 
      return res.send('<script>alert("Wrong username or password"); window.location.href="/login";</script>')
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log("Logout error:", err);
    } else {
      console.log("Session destroyed successfully");
      res.redirect("/");
    }
  });
});

router.get("/signup", function (req, res, next) {
  res.render("signup", { title: "Express", user: req.user });
});

router.post("/signup", async function (req, res, next) {
  const { username, firstname, lastname, password } = req.body;

  const users = await db.sequelize.query('SELECT * FROM users', {
    raw: true,
    type: QueryTypes.SELECT
  });
  console.log('USERS:' + users);
  const existingUser = users.find(u => u.username === username );

  if(existingUser) {
    return res.send('<script>alert("User already exists"); window.location.href="/signup";</script>');
  }

  const fullName = `${firstname} ${lastname}`;

  db.sequelize.query('INSERT INTO Users (username, password, fullName) VALUES (:username, :password, :fullName)', {
      replacements: { username, password, fullName },
      type: QueryTypes.INSERT
    })
    .then(() => res.redirect("/login"))
    .catch((error) => next(error));
});

module.exports = router;

