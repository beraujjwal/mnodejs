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

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  async verifyToken(req, res, next) {
    let token = req.headers['x-access-token'];

    if (!token) {
      return this.ApiRes.errorResponse(res, 'No token provided!');
    }

    try {
      let decoded = await jwt.verify(token, this.env.JWT_SECRET);
      req.user_id = decoded.id;
      //Finding user with set criteria
      let user = await this.User.findOne({ _id: decoded.id });
      if (user === null) {
        return this.ApiRes.errorResponse(res, 'Permission denied!');
      }
      req.user = JSON.parse(JSON.stringify(user));
      next();
      return;
    } catch (ex) {
      return this.ApiRes.errorResponse(res, ex.message);
    }
  }
}

module.exports = new authMiddleware();
