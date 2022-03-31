const express = require('express');
const rolesController = require('../../app/controllers/roles.controller');
const roleValidation = require('../../app/validations/role.validation');
const authMiddleware = require('../../app/middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/v1.0/roles',
  [authMiddleware.verifyToken],
  rolesController.roleList,
);

router.post(
  '/v1.0/role',
  [authMiddleware.verifyToken, roleValidation.create],
  rolesController.roleStore,
);

router.get(
  '/v1.0/role/:id',
  [authMiddleware.verifyToken],
  rolesController.roleDetails,
);

router.put(
  '/v1.0/role/:id',
  [authMiddleware.verifyToken, roleValidation.update],
  rolesController.roleUpdate,
);

router.delete(
  '/v1.0/role/:id',
  [authMiddleware.verifyToken],
  rolesController.roleDelete,
);
module.exports = router;
