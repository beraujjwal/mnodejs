'use strict';
const autoBind = require('auto-bind');
const jwt = require('jsonwebtoken');
const { middleware } = require('./middleware');
const { baseError } = require('@error/baseError');
const redisClient = require('../../libraries/redis.library');

class aclMiddleware extends middleware {
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
   * @param {*} action
   * @param {*} module
   * @returns
   */
  hasPermission(action, module) {
    const userModel = this.User;
    const env = this.env;
    return async function (req, res, next) {      
      let bearerHeader = req.headers['authorization'];

      if( !bearerHeader ){
        throw new baseError(`Authorization token not found.`, 401);
      }

      const token = bearerHeader.split(' ')[1];

      if( !token ){
        throw new baseError(`Authorization token not found.`, 401);
      }

      try {

        let decoded = await jwt.verify(token, env.JWT_SECRET);
        if (!decoded) {
          const err = new Error('Invalid authorization token1.');
          err.statusCode = 401;
          next(err);
        }
        const userId = decoded.id;

        //Finding user with set criteria
        const userData = await redisClient.getValue(userId);
        const userFullData = JSON.parse(userData);
        const user = userFullData.user;

        let haveAccess = false;
        loop1: if (haveAccess === false) {
          //Checking role have permission
          for await (const role of user?.roles) {
            for await (const right of role?.rights) {
              if (right?.resource === 'root') {
                if (right?.fullAccess && right?.fullAccess === true) {
                  haveAccess = true;
                  break loop1;
                }
              }
              if (right?.resource === module) {
                if (right?.fullDeny && right?.fullDeny === false) {
                  break loop1;
                } else if (right?.fullAccess && right?.fullAccess === true) {
                  haveAccess = true;
                  break loop1;
                } else if (right[action] && right[action] === true) {
                  haveAccess = true;
                  break loop1;
                } else {
                  break loop1;
                }
              }
            }
          }

          //Checking user have permission
          for await (const right of user.rights) {
            if (right.resource === 'root') {
              if (right.fullAccess && right.fullAccess === true) {
                haveAccess = true;
                break loop1;
              }
            }
            if (right.resource === module) {
              if (right.fullDeny && right.fullDeny === false) {
                break loop1;
              } else if (right.fullAccess && right.fullAccess === true) {
                haveAccess = true;
                break loop1;
              } else if (right[action] && right[action] === true) {
                haveAccess = true;
                break loop1;
              } else {
                break loop1;
              }
            }
          }
        }

        if (haveAccess == false) {
          const err = new Error('Unauthorized to access this section.');
          err.statusCode = 403;
          next(err);
        }

        next();
        return;
      } catch (ex) {
        console.log(ex);
        next(ex.message);
      }
    };
  }
}

module.exports = new aclMiddleware();
