const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/google', authController.redirectToGoogle);
router.get('/google/callback', authController.handleGoogleCallback);
router.get('/logout', authController.logoutUser);

module.exports = router;