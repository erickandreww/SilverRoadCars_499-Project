var express = require('express');
var router = express.Router();
const controller = require("../controllers/vehiclesController")

/* GET Vehicles Page. */
router.get('/', controller.getAllVehicles);

router.get('/:carId', controller.getCar)

module.exports = router;