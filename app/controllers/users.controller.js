'use strict';
const autoBind = require( 'auto-bind' );
const { Controller } = require('./controller')

class UsersController extends Controller {

  /**
     * Controller constructor
     * @author Ujjwal Bera
     * @param null
     */
  constructor( ) {
    super( );
    this.User = this.db.User;
    this.Role = this.db.Role;
    autoBind( this );
  }

  async create(req, res) {
    // Validate request
    if (!req.body.name) {
      this.ApiRes.validationErrorWithData(res, "User name can not be empty!", req.body )
      return;
    }

    const User = this.User;
  
    // Create a User
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      status: false,
      verified: false
    });
  
    // Save User in the database
    user
      .save(user)
      .then(data => {
        this.ApiRes.successResponseWithData(res, `User created successfully!`,  data);
      })
      .catch(err => {
        this.ApiRes.errorResponse(res, err.message || "Some error occurred while creating the User.");        
      });
  }

}
module.exports = new UsersController();