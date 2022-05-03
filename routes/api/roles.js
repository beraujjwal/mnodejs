const express = require('express');
require('express-router-group');
const rolesController = require('../../app/controllers/roles.controller');
const roleValidation = require('../../app/validations/role.validation');
const authMiddleware = require('../../app/middlewares/auth.middleware');
const aclMiddleware = require('../../app/middlewares/acl.middleware');

const router = express.Router();

router.group('/v1.0', (router) => {
  router.get(
    '/roles',
    [authMiddleware.verifyToken, aclMiddleware.hasPermission('read', 'roles')],
    rolesController.roleList,
  );
  router.group('/role', authMiddleware.verifyToken, (router) => {
    router.post(
      '',
      [aclMiddleware.hasPermission('create', 'roles'), roleValidation.create],
      rolesController.roleStore,
    );

    router.get(
      '/:id',
      [aclMiddleware.hasPermission('read', 'roles')],
      rolesController.roleDetails,
    );

    router.put(
      '/:id',
      [aclMiddleware.hasPermission('update', 'roles'), roleValidation.update],
      rolesController.roleUpdate,
    );

    router.delete(
      '/:id',
      [aclMiddleware.hasPermission('delete', 'roles')],
      rolesController.roleDelete,
    );
  });
});

module.exports = router;
