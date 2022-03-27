const express = require('express');

const permissionsController = require('../../app/controllers/permissions.controller');
const authMiddleware = require('../../app/middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/v1.0/permissions',
  [authMiddleware.verifyToken],
  permissionsController.permissionList,
);

router.post(
  '/v1.0/permission/store',
  [authMiddleware.verifyToken],
  permissionsController.permissionStore,
);

router.get(
  '/v1.0/permission/:id',
  [authMiddleware.verifyToken],
  permissionsController.permissionDetails,
);

router.put(
  '/v1.0/permission/:id',
  [authMiddleware.verifyToken],
  permissionsController.permissionUpdate,
);

router.delete(
  '/v1.0/permission/:id',
  [authMiddleware.verifyToken],
  permissionsController.permissionDelete,
);
module.exports = router;
