'use strict';
const jwt = require('jsonwebtoken');
const autoBind = require('auto-bind');
const { middleware } = require('./middleware');

class authMiddleware extends middleware {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.User = this.db.User;
    autoBind(this);
  }

  async verifyToken(req, res, next) {
    let token = req.headers['x-access-token'];

    if (!token) {
      return this.ApiRes.errorResponse(res, 'No token provided!');
    }

    jwt.verify(token, this.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return this.ApiRes.errorResponse(res, 'Unauthorized!');
      }
      req.user_id = decoded.id;
      try {
        //Finding user with set criteria
        this.User.findOne({ _id: decoded.id })
          .populate('roles', '-__v')
          .exec((err, user) => {
            if (err) {
              return this.ApiRes.errorResponse(res, err.message);
            }
            if (user === null) {
              return this.ApiRes.errorResponse(res, 'Permission denied!');
            }
            req.user = JSON.parse(JSON.stringify(user));
            next();
            return;
          });
      } catch (ex) {
        return this.ApiRes.errorResponse(res, err.message);
      }
    });
  }
}

module.exports = new authMiddleware();
