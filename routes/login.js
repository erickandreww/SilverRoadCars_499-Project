var express = require('express');
var router = express.Router();
const controller = require('../controllers/loginController');

router.get('/', controller.loginView);
router.get('/loginClient', controller.loginViewClient);
router.post('/loginClient', controller.loginClient);
router.get('/loginUser', controller.loginViewUser);
router.post('/loginUser', controller.loginUser);
/*router.post('/', controller.loginUser);*/

module.exports = router;
