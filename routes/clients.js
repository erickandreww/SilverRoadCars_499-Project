var express = require('express');
var router = express.Router();
const clientsController = require('../controllers/clientsController');
const multer = require('multer');
const {verifyToken, requireClient} = require('../middleware/middleware');
const upload = multer({ dest: 'public/uploads/' });

/* All Clients Routes. */
router.get('/profile', verifyToken, requireClient, clientsController.profileController);
router.get('/profile/edit', verifyToken, requireClient, clientsController.editviewController);
router.post('/profile/edit', verifyToken, requireClient, upload.single('clientAvatar'), clientsController.editProfileController);
// router.get('/bookings/current', )
// router.get('/bookings/history', )
router.get('/rent/:vehicleId', verifyToken, requireClient, clientsController.getRentCarView);
router.post('/rent/:vehicleId', clientsController.createBookingClient);
// router.get('/payment/:bookingId', )

/* GET Clients Page. */
router.get('/', clientsController.homeController);

module.exports = router;