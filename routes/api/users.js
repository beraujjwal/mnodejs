const express = require('express');

const usersController = require('../../app/controllers/users.controller');
const authController = require('../../app/controllers/auth.controller');
const userValidation = require('../../app/validations/user.validation');
const authMiddleware = require('../../app/middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/v1.0/auth/signup',
  [userValidation.signup],
  authController.create,
);

router.post('/v1.0/auth/signin', [userValidation.signin], authController.login);

router.get(
  '/v1.0/user/profile',
  [authMiddleware.verifyToken],
  usersController.profile,
);

router.post(
  '/v1.0/user/profile',
  [authMiddleware.verifyToken],
  usersController.updateProfile,
);
module.exports = router;
