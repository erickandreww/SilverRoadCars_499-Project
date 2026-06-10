var express = require('express');
var router = express.Router();

const maintenanceController = require("../controllers/maintenanceController")

/* All Users Routes. */
// router.get('/bookings', )
// router.get('/bookings/requests', )

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users/dashboard', {
    title: 'User Dashboard'
  });
});

// Maintenance
router.get('/maintenance', maintenanceController.getAllMaintenances);
router.get('/maintenance/create', maintenanceController.buildCreateMaintenance);
router.get('/maintenance/:maintenanceId', maintenanceController.getMaintenance);

router.post('/maintenance/new', maintenanceController.createMaintenance);
router.post('/maintenance/update', maintenanceController.updateMaintenance);
router.post('/maintenance/delete', maintenanceController.deleteMaintenance);

module.exports = router;