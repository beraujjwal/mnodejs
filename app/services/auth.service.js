const autoBind = require('auto-bind');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { services } = require('@service/services');

class auth extends services {
  /**
   * services constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.User = this.db.User;
    this.Role = this.db.Role;
    this.regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    autoBind(this);
  }

  async singup({ name, email, phone, password, roles, verified, status }) {
    const transaction = await this.transaction.startSession();

    // Create a User object
    const user = new this.User({
      name: name,
      email: email,
      phone: phone,
      password: bcrypt.hashSync(password, 8),
      status: status ? status : false,
      verified: verified ? verified : false,
    });
    return new Promise((resolve, reject) => {
      // Save User object in the database
      user
        .save(user)
        .then(() => {
          //Check if role is set on submit
          if (roles) {
            //Find selected role
            user.roles = this.Role.find(
              { slug: { $in: roles } },
              (err, roles) => {
                //Throw error occurs when finding roles
                if (err) {
                  return reject(new Error(err.message));
                }

                //Generate object of roles
                user.roles = roles.map((role) => role._id);

                //Save & return roles
                return user.save((err) => {
                  //Throw error occurs while saving roles
                  if (err) {
                    return reject(new Error(err.message));
                  }
                  user.roles = roles;
                  return resolve(user);
                });
              },
            );
          } else {
            //Find default role
            return this.Role.findOne({ slug: 'user' }, (err, role) => {
              //Throw error occurs when finding roles
              if (err) {
                return reject(new Error(err.message));
              }

              //Generate object of roles
              user.roles = [role._id];

              //Save & return roles
              return user.save((err) => {
                //Throw error occurs while saving roles
                if (err) {
                  return reject(new Error(err.message));
                }
                transaction.endSession();
                return resolve(user);
              });
            });
          }
        })
        .catch((err) => {
          return reject(new Error(err.message));
        });
    });
  }

  async singin({ username, password }) {
    //Setting login criterias
    let criteria = username.match(this.regexEmail)
      ? { email: username, status: true, verified: true }
      : { phone: username, status: true, verified: true };

    return new Promise((resolve, reject) => {
      try {
        //Finding user with set criteria
        this.User.findOne(criteria)
          .populate('roles', '-__v')
          .exec((err, user) => {
            if (err) {
              return reject(new Error(err.message));
            }
            if (user === null) {
              return reject(new Error('Invalid Username/Password!'));
            }
            console.log(user);
            const passwordIsValid = bcrypt.compareSync(password, user.password);

            if (!passwordIsValid) {
              return reject(new Error('Invalid Username/Password!'));
            }
            console.log(this.env.JWT_EXPIRES_IN);
            const token = jwt.sign(
              { id: user.id, phone: user.phone, email: user.email },
              this.env.JWT_SECRET,
              {
                expiresIn: this.env.JWT_EXPIRES_IN, // expiresIn time
                algorithm: 'HS256',
              },
            );

            const authorities = [];
            for (const role of user.roles) {
              authorities.push('ROLE_' + role.name.toUpperCase());
            }

            const currDate = new Date(Date.now());
            const expiresIn = new Date(
              parseInt(currDate) + parseInt(this.env.JWT_EXPIRES_IN) * 1000,
            );

            const loginRes = {
              user,
              authorities,
              accessToken: token,
              expiresIn,
            };
            return resolve(loginRes);
          });
      } catch (ex) {
        return reject(new Error(ex.message));
      }
    });
  }
}

module.exports = { auth };
