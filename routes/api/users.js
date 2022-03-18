const express = require('express');

const usersController = require('../../app/controllers/users.controller');
const userValidation = require('../../app/validations/user.validation');

const router = express.Router();

router.post(
  '/v1.0/auth/signup',
  [userValidation.signup],
  usersController.create,
);
router.post(
  '/v1.0/auth/signin',
  [userValidation.signin],
  usersController.login,
);
module.exports = router;
