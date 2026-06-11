var express = require('express');
var router = express.Router();
const clientsController = require('../controllers/clientsController');
const bookingsController = require('../controllers/bookingsController');
const multer = require('multer');
const {verifyToken, requireClient} = require('../middleware/middleware');
const upload = multer({ dest: 'public/uploads/' });

/* All Clients Routes. */
router.get('/profile', verifyToken, requireClient, clientsController.profileController);
router.get('/profile/edit', verifyToken, requireClient, clientsController.editviewController);
router.post('/profile/edit', verifyToken, requireClient, upload.single('clientAvatar'), clientsController.editProfileController);

router.get('/bookings/current', clientsController.getCurrentBookings);
router.get('/bookings/history', clientsController.getBookingHistory);

router.get('/rent/:vehicleId', verifyToken, requireClient, clientsController.getRentCarView);
router.post('/rent/:vehicleId', clientsController.createBookingClient);

router.get('/payment/:bookingId', bookingsController.buildPaymentPage);

/* GET Clients Page. */
router.get('/', clientsController.homeController);
router.post('/payment/:bookingId', bookingsController.processPayment);
router.post("/payment/:bookingId/cancel", bookingsController.cancelBooking);

module.exports = router;