const express = require('express');
require('express-router-group');
const rolesController = require('../app/controllers/roles.controller');
const roleValidation = require('../app/validations/role.validation');
const authMiddleware = require('../app/middlewares/auth.middleware');
const aclMiddleware = require('../app/middlewares/acl.middleware');

const { exceptionHandler } = require('../app/middlewares/exceptionHandler.middleware');

const router = express.Router();

router.group('/v1.0', (router) => {
  router.get( '/roles', [authMiddleware.verifyToken, aclMiddleware.hasPermission('listView', 'role-section')], exceptionHandler(rolesController.rolesList) );
  router.get( '/roles-ddl', [authMiddleware.verifyToken, aclMiddleware.hasPermission('dropDownList', 'role-section')], exceptionHandler(rolesController.rolesDDLList) );

  router.group('/role', (router) => {
    router.post(
      '',
      [
        aclMiddleware.hasPermission('createNew', 'role-section'),
        roleValidation.create,
      ],
      exceptionHandler(rolesController.roleStore)
    );

    router.get(
      '/:id',
      [aclMiddleware.hasPermission('singleDetailsView', 'role-section')],
      exceptionHandler(rolesController.roleDetails)
    );

    router.put(
      '/:id',
      [
        aclMiddleware.hasPermission('updateExisting', 'role-section'),
        roleValidation.update,
      ],
      exceptionHandler(rolesController.roleUpdate)
    );

    router.delete(
      '/:id',
      [aclMiddleware.hasPermission('deleteExisting', 'role-section')],
      exceptionHandler(rolesController.roleDelete)
    );
  });
});

module.exports = router;
