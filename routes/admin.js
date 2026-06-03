var express = require('express');
var router = express.Router();

const usersController = require('../controllers/usersController')
const vehiclesController = require('../controllers/vehiclesController')


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

router.post('/users/newUser', usersController.createNewUser);
router.post('/users/update', usersController.updateUser);
router.post('/users/delete', usersController.deleteUser);


// Vehicles
router.get('/vehicles', vehiclesController.admGetAllVehicles);
router.get('/vehicles/create', vehiclesController.buildCreateCar);
router.get('/vehicles/:vehicleId', vehiclesController.admGetCar);

router.post('/vehicles/newCar', vehiclesController.createNewCar);
router.post('/vehicles/update', vehiclesController.updateCar);
router.post('/vehicles/delete', vehiclesController.deleteCar);


module.exports = router;