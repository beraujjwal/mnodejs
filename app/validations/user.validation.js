'use strict';
const autoBind = require( 'auto-bind' );
const { controller } = require('@controller/controller');
const validator = require('@helper/validate');

class userValidation extends controller {

  /**
     * Validation constructor
     * @author Ujjwal Bera
     * @param null
     */
  constructor( ) {
    super( );
    this.User = this.db.User;
    this.Role = this.db.Role;
    autoBind( this );
  }

  async signup(req, res, next) {
    const validationRule = {
        "name": "required|string",
        "email": "required|email|unique:User,email",        
        "phone": "required|string|unique:User,phone",
        "password": "required|string|min:6"
    }
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            this.ApiRes.validationErrorWithData(res, "Validation failed", err );
        } else {
            next();
        }
    });
}

}
module.exports = new userValidation();