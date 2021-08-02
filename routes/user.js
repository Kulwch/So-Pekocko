/**
 * user routes
 * 
 * Sets paths for requests regarding the user object
 */

const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const accountLimiter = require('../middleware/accountLimiter');

router.post('/signup',  userCtrl.signup);
router.post('/login', accountLimiter, userCtrl.login);

module.exports = router;