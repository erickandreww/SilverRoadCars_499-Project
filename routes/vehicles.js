var express = require('express');
var router = express.Router();

/* GET Vehicles Page. */
router.get('/', function(req, res, next) {
  res.send('Here we will put the cars and some rent informations');
});

// router.get('/:carId', controller.getCar)

module.exports = router;