var express = require('express');
var router = express.Router();

const maintenanceController = require("../controllers/maintenanceController");
const bookingsController= require("../controllers/bookingsController");

/* User Dashboard. */
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

// Bookings
router.get('/bookings', bookingsController.getAllBookings)
router.get('/bookings/requests', bookingsController.getBookingsRequests)
router.get('/bookings/:bookingId', bookingsController.getBooking)

router.post('/bookings/approve', bookingsController.approveBooking)
router.post('/bookings/reject', bookingsController.rejectBooking)
router.post('/bookings/close', bookingsController.closeBooking)


module.exports = router;