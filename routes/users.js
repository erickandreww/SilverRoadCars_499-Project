var express = require('express');
var router = express.Router();

/* All Users Routes. */
// router.get('/bookings', )
// router.get('/bookings/requests', )
// router.get('/maintenance', )
// router.get('/maintenance/:carId', )

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Users Page');
});

module.exports = router;
