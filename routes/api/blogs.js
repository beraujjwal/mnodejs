const express = require('express');
require('express-router-group');
const blogsController = require('../../app/controllers/blogs.controller');
const blogValidation = require('../../app/validations/blog.validation');
const authMiddleware = require('../../app/middlewares/auth.middleware');
const aclMiddleware = require('../../app/middlewares/acl.middleware');

const router = express.Router();
router.group('/v1.0', (router) => {
  router.get(
    '/blogs',
    [authMiddleware.verifyToken, aclMiddleware.hasPermission('read', 'blogs')],
    blogsController.getAll,
  );
  router.group('/blog', authMiddleware.verifyToken, (router) => {
    router.post(
      '',
      [aclMiddleware.hasPermission('create', 'blogs'), blogValidation.create],
      blogsController.insert,
    );

    router.get(
      '/:id',
      [aclMiddleware.hasPermission('read', 'blogs')],
      blogsController.get,
    );

    router.put(
      '/:id',
      [aclMiddleware.hasPermission('write', 'blogs'), blogValidation.update],
      blogsController.update,
    );

    router.delete(
      '/:id',
      [aclMiddleware.hasPermission('delete', 'blogs')],
      blogsController.delete,
    );
  });
});
module.exports = router;
