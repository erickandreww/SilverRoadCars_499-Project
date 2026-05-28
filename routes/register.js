var express = require('express');
var router = express.Router();
const controller = require('../controllers/registerController');

router.get('/', controller.registerView);
router.post('/', controller.registerUser);

module.exports = router;
