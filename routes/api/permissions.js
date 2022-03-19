const express = require('express');

const permissionsController = require('../../app/controllers/permissions.controller');
const authMiddleware = require('../../app/middlewares/authMiddleware');

const router = express.Router();

router.get(
  '/v1.0/permission/list',
  [authMiddleware.verifyToken],
  permissionsController.permissionList,
);

router.post(
  '/v1.0/permission/store',
  [authMiddleware.verifyToken],
  permissionsController.permissionStore,
);
module.exports = router;
