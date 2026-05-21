var express = require('express');
var router = express.Router();

/* All Clients Routes. */
// router.get('/profile', )
// router.get('/bookings/current', )
// router.get('/bookings/history', )
// router.get('/rent/:carId', )
// router.get('/payment/:bookingId', )

/* GET Clients Page. */
router.get('/', function(req, res, next) {
  res.send('Clients page');
});

module.exports = router;