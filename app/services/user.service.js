const autoBind = require('auto-bind');
const { service } = require('@service/service');

class user extends service {
  /**
   * user service constructor
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

  async getProfile(profileId) {
    //var lang = getLocale();
    //Setting login criterias
    const userId = profileId;
    return new Promise((resolve, reject) => {
      try {
        //Finding user with set criteria
        console.log(userId);
        this.User.findOne({ _id: userId })
          .populate('roles', '-__v')
          .exec((err, user) => {
            if (err) {
              return reject(new Error(err.message));
            }
            if (user === null) {
              return reject(new Error(__('LOGIN_INVALID_USERNAME_PASSWORD')));
            }
            return resolve(user);
          });
      } catch (ex) {
        return reject(new Error(ex.message));
      }
    });
  }

  async updateProfile(profileId, { name, email, phone, roles }) {
    // Create a User object
    const user = new this.User({
      name: name,
      email: email,
      phone: phone,
      _id: profileId,
    });
    let userId = profileId;
    return new Promise((resolve, reject) => {
      // Save User object in the database
      this.User.findByIdAndUpdate(
        userId,
        { $push: { user } },
        {
          new: true,
          upsert: true,
          runValidators: true,
          select: '-roles -_id -updatedAt -createdAt',
        },
      )
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
            return resolve(user);
          }
        })
        .catch((err) => {
          return reject(new Error(err.message));
        });
    });
  }
}

module.exports = { user };
