var express = require('express');
var router = express.Router();
const controller = require('../controllers/contactController');

router.get('/', controller.contactView);
router.post('/', controller.submitContact);

module.exports = router;
