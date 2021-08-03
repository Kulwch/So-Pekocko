/**
 * user routes
 * 
 * Sets paths for requests regarding the user object
 * @accountLimiter is used on login to prevent from brute force attack
 * @passwordVerify checks for password's strength and match with model (/models/password.js)
 */

const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

const accountLimiter = require('../middleware/accountLimiter');
const passwordVerify = require('../middleware/passwordVerify');

router.post('/signup', passwordVerify, userCtrl.signup);
router.post('/login', accountLimiter, userCtrl.login);

module.exports = router;