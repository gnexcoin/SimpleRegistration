var express = require('express');
var router = express.Router();
var db = require("../db");

function isString(x) {
  return Object.prototype.toString.call(x) === "[object String]"
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/* GET users listing. */
router.post('/', (req, res, next) => {
  var name = req.body.name;
  var password = req.body.password;
  var email = req.body.email;

  if (!isString(name)) {
    req.flash('error', 'Expected name');
    return res.redirect("/");
  }

  if (name.length < 3) {
    req.flash('error', 'Expected name length greater or equal than 3 symbols');
    return res.redirect("/");
  }

  if (!isString(password)) {
    req.flash('error', 'Expected password');
    return res.redirect("/");
  }

  if (password.length < 8) {
    req.flash('error', 'Expected password length greater or equal than 8 symbols');
    return res.redirect("/");
  }

  if (!isString(email)) {
    req.flash('error', 'Expected email');
    return res.redirect("/");
  }

  if (!validateEmail(email)) {
    req.flash('error', 'Invalid email format');
    return res.redirect("/");
  }

  db.insertRequest(req.app.locals.db, name, password, email).then(()=> {
    req.flash('success', 'Registration request sent');
    res.redirect("/");
  }).catch(next)
});

module.exports = router;
