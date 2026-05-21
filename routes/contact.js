var express = require('express');
var router = express.Router();

/* GET Contact Page. */
router.get('/', function(req, res, next) {
  res.send('Contact Us page');
});

module.exports = router;