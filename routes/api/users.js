const express = require('express');
require('express-router-group');
const usersController = require('../../app/controllers/users.controller');
const authController = require('../../app/controllers/auth.controller');
const userValidation = require('../../app/validations/user.validation');
const authMiddleware = require('../../app/middlewares/auth.middleware');
const aclMiddleware = require('../../app/middlewares/acl.middleware');

const router = express.Router();

router.group('/v1.0', (router) => {
  router.group('/auth', (router) => {
    router.post('/signup', [userValidation.signup], authController.register);

    router.post('/signin', [userValidation.signin], authController.login);

    router.post(
      '/forgot-password',
      [userValidation.forgotPassword],
      authController.forgotPassword,
    );

    router.post(
      '/reset-password',
      [userValidation.forgotPassword],
      authController.resetPassword,
    );
  });

  router.group('/user', authMiddleware.verifyToken, (router) => {
    router.get('/profile', usersController.profile);

    router.put(
      '/profile',
      [userValidation.profile],
      usersController.updateProfile,
    );

    router.post(
      '/change-password',
      [userValidation.changePassword],
      usersController.changePassword,
    );

    router.post(
      '/store',
      [aclMiddleware.hasPermission('create', 'users')],
      usersController.userStore,
    );

    router.get(
      '/:id',
      [aclMiddleware.hasPermission('read', 'users')],
      usersController.userDetails,
    );

    router.put(
      '/:id',
      [aclMiddleware.hasPermission('write', 'users')],
      usersController.userUpdate,
    );

    router.delete(
      '/:id',
      [aclMiddleware.hasPermission('delete', 'users')],
      usersController.userDelete,
    );
  });

  router.get(
    '/users',
    [authMiddleware.verifyToken, aclMiddleware.hasPermission('read', 'users')],
    usersController.userList,
  );
});

module.exports = router;
