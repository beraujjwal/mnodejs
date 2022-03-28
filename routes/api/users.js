const express = require('express');

const usersController = require('../../app/controllers/users.controller');
const authController = require('../../app/controllers/auth.controller');
const userValidation = require('../../app/validations/user.validation');
const authMiddleware = require('../../app/middlewares/auth.middleware');
const aclMiddleware = require('../../app/middlewares/acl.middleware');

const router = express.Router();

router.post(
  '/v1.0/auth/signup',
  [userValidation.signup],
  authController.register,
);

router.post('/v1.0/auth/signin', [userValidation.signin], authController.login);

router.post(
  '/v1.0/auth/forgot-password',
  [userValidation.forgotPassword],
  authController.forgotPassword,
);

router.get(
  '/v1.0/user/profile',
  [authMiddleware.verifyToken],
  usersController.profile,
);

router.post(
  '/v1.0/user/profile',
  [authMiddleware.verifyToken, userValidation.profile],
  usersController.updateProfile,
);

router.post(
  '/v1.0/user/change-password',
  [authMiddleware.verifyToken, userValidation.changePassword],
  usersController.changePassword,
);

router.get(
  '/v1.0/users',
  [authMiddleware.verifyToken, aclMiddleware.hasPermission('read', 'users')],
  usersController.userList,
);

router.post(
  '/v1.0/user/store',
  [authMiddleware.verifyToken, aclMiddleware.hasPermission('create', 'users')],
  usersController.userStore,
);

router.get(
  '/v1.0/user/:id',
  [authMiddleware.verifyToken, aclMiddleware.hasPermission('read', 'users')],
  usersController.userDetails,
);

router.put(
  '/v1.0/user/:id',
  [authMiddleware.verifyToken, aclMiddleware.hasPermission('write', 'users')],
  usersController.userUpdate,
);

router.delete(
  '/v1.0/user/:id',
  [authMiddleware.verifyToken, aclMiddleware.hasPermission('delete', 'users')],
  usersController.userDelete,
);
module.exports = router;
