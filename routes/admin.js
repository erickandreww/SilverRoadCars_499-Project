var express = require('express');
var router = express.Router();

const usersController = require('../controllers/usersController')
const vehiclesController = require('../controllers/vehiclesController')

const userValidation = require('../utilities/userValidation')
const vehicleValidation = require('../utilities/vehiclesValidation')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/dashboard', {
    title: 'Admin Dashboard'
  });
});


// Users
router.get('/users', usersController.getAllUsers);
router.get('/users/create', usersController.buildCreateUser);
router.get('/users/:userId', usersController.getUserAdm);

router.post(
  '/users/newUser', 
  userValidation.userRules(), 
  userValidation.checkUserData, 
  usersController.createNewUser
);

router.post(
'/users/update', 
  userValidation.userRules(), 
  userValidation.checkUpdateUserData,
  usersController.updateUser
);

router.post('/users/delete', usersController.deleteUser);


// Vehicles
router.get('/vehicles', vehiclesController.admGetAllVehicles);
router.get('/vehicles/create', vehiclesController.buildCreateCar);
router.get('/vehicles/:vehicleId', vehiclesController.admGetCar);

router.post(
  '/vehicles/newCar', 
  vehicleValidation.vehicleRules(),
  vehicleValidation.checkVehicleData,
  vehiclesController.createNewCar
);

router.post(
  '/vehicles/update', 
  vehicleValidation.vehicleRules(),
  vehicleValidation.checkUpdateVehicleData,
  vehiclesController.updateCar
);

router.post('/vehicles/delete', vehiclesController.deleteCar);


module.exports = router;