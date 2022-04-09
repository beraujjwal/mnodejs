'use strict';
const jwt = require('jsonwebtoken');
const autoBind = require('auto-bind');
const { middleware } = require('./middleware');

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
    let userModel = this.User;
    let ApiRes = this.ApiRes;

    return async function (req, res, next) {
      let criteria = {
        status: true,
        verified: true,
        _id: req.user.id,
      };
      let user = await userModel
        .findOne(criteria)
        .populate('roles', '-__v')
        .exec();

      /*.populate(
			[
				{
					path: 'candidateId',
					model: 'Candidate',
					select: 'firstName status avatar',
					match: {clientAgeGroup: "adult", candidatetatus: "new"}
				},
   				{
					path: 'billingId',
					model: 'Billing',
					select: "status",
					match: {paymentStatus: "paid"}
				}
			])
   		);*/

      let haveAccess = false;
      loop1: if (haveAccess === false) {
        //Checking role have permission
        for await (const role of user.roles) {
          for await (const right of role.rights) {
            if (right.resource === 'root') {
              if (right.full && right.full === true) {
                haveAccess = true;
                break loop1;
              }
            }
            if (right.resource === module) {
              if (right.deny && right.deny === false) {
                break loop1;
              } else if (right.full && right.full === true) {
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
            if (right.full && right.full === true) {
              haveAccess = true;
              break loop1;
            }
          }
          if (right.resource === module) {
            if (right.deny && right.deny === false) {
              break loop1;
            } else if (right.full && right.full === true) {
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
        return ApiRes.errorResponse(res, 'Permission denied!');
      }

      next();
      return;
    };
  }
}

module.exports = new aclMiddleware();
