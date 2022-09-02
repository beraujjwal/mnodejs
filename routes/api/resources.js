const express = require('express');
require('express-router-group');
const resourcesController = require('../../app/controllers/resources.controller');
const resourceValidation = require('../../app/validations/resource.validation');
const authMiddleware = require('../../app/middlewares/auth.middleware');
const aclMiddleware = require('../../app/middlewares/acl.middleware');

const router = express.Router();

router.group('/v1.0', (router) => {
  router.get(
    '/resources',
    [
      authMiddleware.verifyToken,
      aclMiddleware.hasPermission('read', 'resources'),
    ],
    resourcesController.resourceList,
  );
  router.group('/resource', authMiddleware.verifyToken, (router) => {
    router.post(
      '',
      [
        aclMiddleware.hasPermission('create', 'resources'),
        resourceValidation.create,
      ],
      resourcesController.resourceStore,
    );

    router.get(
      '/:id',
      [aclMiddleware.hasPermission('read', 'resources')],
      resourcesController.resourceDetails,
    );

    router.put(
      '/:id',
      [
        aclMiddleware.hasPermission('update', 'resources'),
        resourceValidation.update,
      ],
      resourcesController.resourceUpdate,
    );

    router.delete(
      '/:id',
      [aclMiddleware.hasPermission('delete', 'resources')],
      resourcesController.resourceDelete,
    );
  });
});

module.exports = router;
