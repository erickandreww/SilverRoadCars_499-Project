var express = require('express');
var router = express.Router();

const vehiclesController = require('../controllers/vehiclesController')
const usersController = require('../controllers/usersController')


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


// Vehicles


module.exports = router;