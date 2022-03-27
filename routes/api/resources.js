const express = require('express');

const resourcesController = require('../../app/controllers/resources.controller');
const authMiddleware = require('../../app/middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/v1.0/resources',
  [authMiddleware.verifyToken],
  resourcesController.resourceList,
);

router.post(
  '/v1.0/resource/store',
  [authMiddleware.verifyToken],
  resourcesController.resourceStore,
);

router.get(
  '/v1.0/resource/:id',
  [authMiddleware.verifyToken],
  resourcesController.resourceDetails,
);

router.put(
  '/v1.0/resource/:id',
  [authMiddleware.verifyToken],
  resourcesController.resourceUpdate,
);

router.delete(
  '/v1.0/resource/:id',
  [authMiddleware.verifyToken],
  resourcesController.resourceDelete,
);
module.exports = router;
