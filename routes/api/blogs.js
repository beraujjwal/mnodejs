const express = require('express');
require('express-router-group');
const blogsController = require('../../app/controllers/blogs.controller');
const blogValidation = require('../../app/validations/blog.validation');
const authMiddleware = require('../../app/middlewares/auth.middleware');
const aclMiddleware = require('../../app/middlewares/acl.middleware');

const router = express.Router();
router.group('/v1.0', authMiddleware.verifyToken, (router) => {
  router.get(
    '/blogs',
    [aclMiddleware.hasPermission('read', 'blogs')],
    blogsController.blogList,
  );
  router.group('/blog', (router) => {
    router.post(
      '',
      [aclMiddleware.hasPermission('create', 'blogs'), blogValidation.create],
      blogsController.insert,
    );

    router.get(
      '/:id',
      [aclMiddleware.hasPermission('read', 'blogs')],
      blogsController.blogDetails,
    );

    router.put(
      '/:id',
      [aclMiddleware.hasPermission('write', 'blogs'), blogValidation.update],
      blogsController.blogUpdate,
    );

    router.delete(
      '/:id',
      [aclMiddleware.hasPermission('delete', 'blogs')],
      blogsController.blogDelete,
    );
  });
});
module.exports = router;
