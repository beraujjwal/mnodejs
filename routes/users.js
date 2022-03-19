const express = require('express');

//const usersController = require('../app/controllers/users.controller');
const authController = require('../app/controllers/auth.controller');
const userValidation = require('../app/validations/user.validation');

const router = express.Router();

router.post('/auth/signup', [userValidation.signup], authController.create);
router.post('/auth/signin', [userValidation.signin], authController.login);

module.exports = router;
