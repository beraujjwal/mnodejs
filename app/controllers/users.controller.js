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
    this.UserRole = this.db.UserRole;
    autoBind( this );
  }

  async create(req, res) {
    // Validate request
    if (!req.body.title) {
      res.status(400).send({ message: "Content can not be empty!" });
      return;
    }
  
    // Create a User
    const user = new this.User({
      title: req.body.title,
      description: req.body.description,
      published: req.body.published ? req.body.published : false
    });
  
    // Save User in the database
    user
      .save(user)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      });
  }

}
module.exports = new UsersController();