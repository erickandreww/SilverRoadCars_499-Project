var express = require('express');
var router = express.Router();
const controller = require("../controllers/usersController")

/* All Users Routes. */
// router.get('/bookings', )
// router.get('/bookings/requests', )
// router.get('/maintenance', )
// router.get('/maintenance/:carId', )

/* GET users listing. */
router.get('/', controller.getAllUsers);

module.exports = router;
