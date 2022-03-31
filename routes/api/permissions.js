const express = require('express');
const permissionsController = require('../../app/controllers/permissions.controller');
const permissionValidation = require('../../app/validations/permission.validation');
const authMiddleware = require('../../app/middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/v1.0/permissions',
  [authMiddleware.verifyToken],
  permissionsController.permissionList,
);

router.post(
  '/v1.0/permission',
  [authMiddleware.verifyToken, permissionValidation.create],
  permissionsController.permissionStore,
);

router.get(
  '/v1.0/permission/:id',
  [authMiddleware.verifyToken],
  permissionsController.permissionDetails,
);

router.put(
  '/v1.0/permission/:id',
  [authMiddleware.verifyToken, permissionValidation.update],
  permissionsController.permissionUpdate,
);

router.delete(
  '/v1.0/permission/:id',
  [authMiddleware.verifyToken],
  permissionsController.permissionDelete,
);
module.exports = router;
