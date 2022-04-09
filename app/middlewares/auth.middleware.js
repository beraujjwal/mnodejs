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
      next('Authorization token not found!');
    }

    try {
      let decoded = await jwt.verify(token, this.env.JWT_SECRET);
      if (!decoded) {
        next('Invalid authorization token.');
      }
      req.user_id = decoded.id;
      //Finding user with set criteria
      let user = await this.User.findOne({
        _id: decoded.id,
        verified: true,
        status: true,
        deleted: false,
      });
      if (user === null) {
        next('Invalid authorization token.');
      }
      req.user = JSON.parse(JSON.stringify(user));
      next();
      return;
    } catch (ex) {
      next('Invalid authorization token.');
    }
  }
}

module.exports = new authMiddleware();
