var express = require('express');
var router = express.Router();

const { requireClient, requireUser, requireManager} = require("../middleware/middleware")

// All routes
router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/vehicles', require('./vehicles'));
router.use('/contact', require('./contact'));
router.use('/clients', requireClient, require('./clients'));
router.use('/users', requireUser, require('./users'));
router.use('/admin', requireManager, require('./admin'));
router.use('/auth', require('./authRoutes'));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Silver Road Cars' });
});


module.exports = router;
