const express = require('express');
require('express-router-group');
const resourcesController = require('../app/controllers/resources.controller');
const resourceValidation = require('../app/validations/resource.validation');
const authMiddleware = require('../app/middlewares/auth.middleware');
const aclMiddleware = require('../app/middlewares/acl.middleware');

const { exceptionHandler } = require('../app/middlewares/exceptionHandler.middleware');

const router = express.Router();

router.group('/v1.0', (router) => {
  router.get( '/resources', exceptionHandler(resourcesController.resourcesList) );

  router.group('/resource', (router) => {
    router.post(
      '',
      [
        aclMiddleware.hasPermission('create', 'resources'),
        resourceValidation.create,
      ],
      exceptionHandler(resourcesController.resourceStore)
    );

    router.get(
      '/:id',
      [aclMiddleware.hasPermission('read', 'resources')],
      exceptionHandler(resourcesController.resourceDetails)
    );

    router.put(
      '/:id',
      [
        aclMiddleware.hasPermission('update', 'resources'),
        resourceValidation.update,
      ],
      exceptionHandler(resourcesController.resourceUpdate)
    );

    router.patch(
      '/:id',
      [
        aclMiddleware.hasPermission('update', 'resources')
      ],
      exceptionHandler(resourcesController.resourceStatusUpdate)
    );

    router.delete(
      '/:id',
      [aclMiddleware.hasPermission('delete', 'resources')],
      exceptionHandler(resourcesController.resourceDelete)
    );
  });
});

module.exports = router;
