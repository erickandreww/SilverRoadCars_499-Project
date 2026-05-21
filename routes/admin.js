var express = require('express');
var router = express.Router();

/* All Admin Routes. */
// router.get('/vehicles', )
// router.get('/users', )
// router.get('/clients', )

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Admin Page');
});

module.exports = router;