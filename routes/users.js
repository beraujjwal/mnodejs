const express = require('express');

const usersController = require('../app/controllers/users.controller');
const userValidation = require('../app/validations/user.validation');

const router = express.Router();

router.post('/auth/signup', [userValidation.signup], usersController.create);
router.post('/auth/signin', [userValidation.signin], usersController.login);

module.exports = router;
