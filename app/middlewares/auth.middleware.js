'use strict';
const jwt = require('jsonwebtoken');
const autoBind = require('auto-bind');
const { middleware } = require('./middleware');
const { baseError } = require('@error/baseError');
const redisClient = require('../../libraries/redis.library');

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
    let bearerHeader = req.headers['authorization'];

    let userRole = req.params.role;
    req.role = userRole;
    
    if( !bearerHeader ){
      throw new baseError(`Authorization token not found.`, 401);
    }

    const token = bearerHeader.split(' ')[1];
    if( !token ){
      throw new baseError(`Unauthorized to access this section.`, 401);
    }

    try {
      let decoded = await jwt.verify(token, this.env.JWT_SECRET);
      if (!decoded) {
        throw new baseError(`Invalid authorization token2.`, 401);
      }      
      const userId = decoded.id;

      let isCompleted = decoded.isCompleted;

      if (isCompleted === false) {
        throw new baseError(`Unauthorized to access this section.`, 401);
      }

      const userData = await redisClient.getValue(userId);
      const user = JSON.parse(userData);

      if (user === null || user.isCompleted === false || user.user.tokenSalt !== decoded.tokenSalt) {
        throw new baseError(`Invalid authorization token3.`, 401);
      }

      const authorities = [];
      for await (const role of user.roles) {
        authorities.push(role?.slug);
      }

      if(userRole) {
        if(!authorities.includes(userRole)) {
          throw new baseError(`Invalid authorization token4.`, 401);
        }
      }
      
      req.user = JSON.parse(JSON.stringify(user));
      next();

      return;
    } catch (ex) {
      next(ex.message);
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   */
  async verifyiNCompletedToken(req, res, next) {

    let bearerHeader = req.headers['authorization'];

    let userRole = req.params.role;
    req.role = userRole;
    if( !bearerHeader ){
      next('Authorization token not found!');
    }

    const token = bearerHeader.split(' ')[1];
    if( !token ){
      next('Authorization token not found!!');
    }

    try {
      let decoded = await jwt.verify(token, this.env.JWT_SECRET);
      if (!decoded) {
        next('Invalid authorization token4.');
      } 
      
      console.debug('decoded', decoded)
      req.user_id = decoded.id;

      let salt = (decoded.tokenSalt) ? decoded.tokenSalt : 1;
      //Finding user with set criteria
      let user = await this.User.findOne({
        _id: decoded.id,
        tokenSalt: salt,
        deleted: false,
      }).populate('roles', '-__v').exec();

      if (user === null) {
        next('Invalid authorization token5.');
      }

      const authorities = [];
      for await (const role of user.roles) {
        authorities.push(role?.slug);
      }

      if(userRole) {
        if(!authorities.includes(userRole)) {
          next('Invalid authorization token6.');
        }        
      }

      req.user = JSON.parse(JSON.stringify(user));
      next();

      return;
    } catch (ex) {
      next(ex.message);
    }
  }
}

module.exports = new authMiddleware();