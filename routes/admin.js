var express = require('express');
var router = express.Router();

const usersController = require('../controllers/usersController')
const vehiclesController = require('../controllers/vehiclesController')

const { requireUser, requireManager} = require("../middleware/middleware")
const userValidation = require('../utilities/userValidation')
const vehicleValidation = require('../utilities/vehiclesValidation')


/* GET users listing. */
router.get('/', requireUser, function(req, res, next) {
  res.render('admin/dashboard', {
    title: 'Admin Dashboard'
  });
});


// Users
router.get('/users', requireManager, usersController.getAllUsers);
router.get('/users/create', requireManager, usersController.buildCreateUser);
router.get('/users/:userId', requireManager, usersController.getUserAdm);

router.post(
  '/users/newUser', 
  requireManager, 
  userValidation.userRules(), 
  userValidation.checkUserData, 
  usersController.createNewUser
);

router.post(
'/users/update', 
  requireManager, 
  userValidation.userRules(), 
  userValidation.checkUpdateUserData,
  usersController.updateUser
);

router.post('/users/delete', requireManager, usersController.deleteUser);


// Vehicles
router.get('/vehicles', requireManager, vehiclesController.admGetAllVehicles);
router.get('/vehicles/create', requireManager, vehiclesController.buildCreateCar);
router.get('/vehicles/:vehicleId', requireManager, vehiclesController.admGetCar);

router.post(
  '/vehicles/newCar', 
  requireManager, 
  vehicleValidation.vehicleRules(),
  vehicleValidation.checkVehicleData,
  vehiclesController.createNewCar
);

router.post(
  '/vehicles/update', 
  requireManager, 
  vehicleValidation.vehicleRules(),
  vehicleValidation.checkUpdateVehicleData,
  vehiclesController.updateCar
);

router.post('/vehicles/delete', requireManager, vehiclesController.deleteCar);


module.exports = router;