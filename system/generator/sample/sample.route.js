const express = require('express');
require('express-router-group');
const CONTROLLER_CAMEL_CASE_PLURAL_FORMController = require('../app/controllers/CONTROLLER_CAMEL_CASE_PLURAL_FORM.controller');
const VALIDATION_CAMEL_CASE_SINGULAR_FROMValidation = require('../app/validations/VALIDATION_CAMEL_CASE_SINGULAR_FROM.validation');
const authMiddleware = require('../app/middlewares/auth.middleware');
const aclMiddleware = require('../app/middlewares/acl.middleware');

const router = express.Router();
router.group('/v1.0', (router) => {
  router.get(
    '/PLURAL_SAMLL_CASE',
    [
      authMiddleware.verifyToken,
      aclMiddleware.hasPermission('read', 'PLURAL_SAMLL_CASE'),
    ],
    CONTROLLER_CAMEL_CASE_PLURAL_FORMController.getAll,
  );
  router.group('/SINGULAR_SAMLL_CASE', authMiddleware.verifyToken, (router) => {
    router.post(
      '',
      [
        aclMiddleware.hasPermission('create', 'PLURAL_SAMLL_CASE'),
        VALIDATION_CAMEL_CASE_SINGULAR_FROMValidation.create,
      ],
      CONTROLLER_CAMEL_CASE_PLURAL_FORMController.insert,
    );

    router.get(
      '/:id',
      [aclMiddleware.hasPermission('read', 'PLURAL_SAMLL_CASE')],
      CONTROLLER_CAMEL_CASE_PLURAL_FORMController.get,
    );

    router.put(
      '/:id',
      [
        aclMiddleware.hasPermission('write', 'PLURAL_SAMLL_CASE'),
        VALIDATION_CAMEL_CASE_SINGULAR_FROMValidation.update,
      ],
      CONTROLLER_CAMEL_CASE_PLURAL_FORMController.update,
    );

    router.delete(
      '/:id',
      [aclMiddleware.hasPermission('delete', 'PLURAL_SAMLL_CASE')],
      CONTROLLER_CAMEL_CASE_PLURAL_FORMController.delete,
    );
  });
});
module.exports = router;
