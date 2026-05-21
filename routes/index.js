var express = require('express');
var router = express.Router();

// All routes
router.use('/login', require('./login'));
router.use('/register', require('./register'));
router.use('/vehicles', require('./vehicles'));
router.use('/contact', require('./contact'));
router.use('/clients', require('./clients'));
router.use('/users', require('./users'));
router.use('/admin', require('./admin'));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
