const express = require('express');

//const usersController = require('../app/controllers/users.controller');
const authController = require('../app/controllers/auth.controller');
const userValidation = require('../app/validations/user.validation');

const router = express.Router();
router.post('/auth/signup', [userValidation.signup], authController.register);
router.post('/auth/signin', [userValidation.signin], authController.login);

router.get('/auth/verify/:user_id/:token', [], authController.verify);
router.get('/auth/reset/:user_id/:token', [], authController.reset);

module.exports = router;
