var passport = require('passport');
var LocalStrategy = require('passport-local');
var db = require('../models');
const { QueryTypes } = require('sequelize');

passport.use(
  new LocalStrategy(
    async function (username, password, cb) {
      try {
        const rawQuery = 'SELECT * FROM users WHERE username = :username';
        const users = await db.sequelize.query(rawQuery, {
          replacements: { username },
          type: QueryTypes.SELECT
        });

        const user = users[0];
        if (!user) {
          return cb(null, false, { message: "Incorrect username." });
        }
        if (password !== user.password) { 
          return cb(null, false, { message: "Incorrect password." });
        }
        return cb(null, user);
      } catch (error) {
        console.error("Query error:", error);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
  try {
    const rawQuery = 'SELECT * FROM users WHERE id = :id';
    const users = await db.sequelize.query(rawQuery, {
      replacements: { id },
      type: QueryTypes.SELECT
    });

    const user = users[0];
    if (user) {
      cb(null, user);
    } else {
      cb(new Error('User not found'));
    }
  } catch (error) {
    cb(error);
  }
});

function isCustomer(req, res, next) {
  if (req.isAuthenticated() && req.user.roleId === 2) return next();
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.roleId === 1) return next();
  res.redirect("/login");
}

module.exports = {
  isCustomer: isCustomer,
  isAdmin: isAdmin,
};
