const express = require('express');
const resourcesController = require('../../app/controllers/resources.controller');
const resourceValidation = require('../../app/validations/resource.validation');
const authMiddleware = require('../../app/middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/v1.0/resources',
  [authMiddleware.verifyToken],
  resourcesController.resourceList,
);

router.post(
  '/v1.0/resource',
  [authMiddleware.verifyToken, resourceValidation.create],
  resourcesController.resourceStore,
);

router.get(
  '/v1.0/resource/:id',
  [authMiddleware.verifyToken],
  resourcesController.resourceDetails,
);

router.put(
  '/v1.0/resource/:id',
  [authMiddleware.verifyToken, resourceValidation.update],
  resourcesController.resourceUpdate,
);

router.delete(
  '/v1.0/resource/:id',
  [authMiddleware.verifyToken],
  resourcesController.resourceDelete,
);
module.exports = router;
