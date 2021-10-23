'use strict';
const autoBind = require( 'auto-bind' );
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { controller } = require('./controller');
const { Auth } = require('@service/auth.service');

class usersController extends controller {

  /**
     * Controller constructor
     * @author Ujjwal Bera
     * @param null
     */
  constructor( ) {
    super( );
    this.User = this.db.User;
    this.Role = this.db.Role;
    this.regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    autoBind( this );
  }

  async create(req, res) {
  

    const transaction = await this.transaction.startSession(); 
    // Create a User
    const user = new this.User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, 8),
      status: false,
      verified: false
    });
  
    // Save User in the database
    user.save(user)
      .then(data => {
        if (req.body.roles) {
          this.Role.find(
            {
              slug: { $in: req.body.roles }
            },
            (err, roles) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
    
              user.roles = roles.map(role => role._id);
              user.save(err => {
                if (err) {
                  res.status(500).send({ message: err });
                  return;
                }
     
                this.ApiRes.successResponseWithData(res, `User created successfully!`,  data);
              });
            }
          );
        } else {
          this.Role.findOne({ slug: "user" }, (err, role) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
    
            user.roles = [role._id];
            user.save(err => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
    
              this.ApiRes.successResponseWithData(res, `User created successfully!`,  data);
            });
          });
        }
        transaction.endSession();
      })
      .catch(err => {
        console.log(err);
        this.ApiRes.errorResponse(res, err.message || "Some error occurred while creating the User.");
      });
  }


  async signin(req, res){

    const { username, password } = req.body;
    let criteria = (username.match(this.regexEmail)) ? {email: username, status: true, verified: true} : {phone: username, status: true,verified: true};

    this.User.findOne(criteria)
      .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          this.ApiRes.errorResponse(res, err.message || "Some error occurred while login.");
        }
  
        if (!user) {
          this.ApiRes.errorResponse(res, "User Not found."); 
        }
  
        const passwordIsValid = bcrypt.compareSync(
          password,
          user.password
        );
  
        if (!passwordIsValid) {
          this.ApiRes.unauthorizedResponse(res, "Invalid Username/Password!");          
        }        
  
        const token = jwt.sign({ id: user.id, phone: user.phone, email: user.email }, this.env.JWT_SECRET, {
          expiresIn: this.env.JWT_EXPIRES_IN, // expiresIn time
          algorithm: 'HS256'
        });
  
        const authorities = [];
  
        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }

        const currDate = new Date(Date.now());        
        const expiresIn = new Date(parseInt(currDate) + parseInt(this.env.JWT_EXPIRES_IN) * 1000);

        const loginRes = { user, authorities, accessToken: token, expiresIn }

        this.ApiRes.successResponseWithData(res, "User login successfully!", loginRes); 
        
      });
  }

}
module.exports = new usersController();