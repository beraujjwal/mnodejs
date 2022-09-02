const express = require('express');
require('express-router-group');
const permissionsController = require('../../app/controllers/permissions.controller');
const permissionValidation = require('../../app/validations/permission.validation');
const authMiddleware = require('../../app/middlewares/auth.middleware');
const aclMiddleware = require('../../app/middlewares/acl.middleware');

const router = express.Router();

router.group('/v1.0', (router) => {
  router.get(
    '/permissions',
    [
      authMiddleware.verifyToken,
      aclMiddleware.hasPermission('read', 'permissions'),
    ],
    permissionsController.permissionList,
  );
  router.group('/permission', authMiddleware.verifyToken, (router) => {
    router.post(
      '',
      [
        aclMiddleware.hasPermission('create', 'permissions'),
        permissionValidation.create,
      ],
      permissionsController.permissionStore,
    );

    router.get(
      '/:id',
      [aclMiddleware.hasPermission('read', 'permissions')],
      permissionsController.permissionDetails,
    );

    router.put(
      '/:id',
      [
        aclMiddleware.hasPermission('update', 'permissions'),
        permissionValidation.update,
      ],
      permissionsController.permissionUpdate,
    );

    router.delete(
      '/:id',
      [aclMiddleware.hasPermission('delete', 'permissions')],
      permissionsController.permissionDelete,
    );
  });
});

module.exports = router;
