var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Registration', successFlash: req.flash('success'), errorFlash: req.flash('error') });
});

module.exports = router;
