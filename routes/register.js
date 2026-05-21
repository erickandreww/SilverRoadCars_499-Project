var express = require('express');
var router = express.Router();

/* GET Register page. */
router.get('/', function(req, res, next) {
  res.send('Register');
});

module.exports = router;