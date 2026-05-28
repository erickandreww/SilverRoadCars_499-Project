var express = require('express');
var router = express.Router();
const controller = require('../controllers/loginController');

router.get('/', controller.loginView);
router.post('/', controller.loginUser);

module.exports = router;
