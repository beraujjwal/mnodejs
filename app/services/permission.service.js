const autoBind = require('auto-bind');
const { service } = require('@service/service');

class permission extends service {
  /**
   * permission service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.Permission = this.db.Permission;
    this.Role = this.db.Role;
    this.User = this.db.User;
    this.regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    autoBind(this);
  }

  async permissionList() {
    //var lang = getLocale();
    //Setting login criterias
    const permissionId = 0;
    return new Promise((resolve, reject) => {
      try {
        //Finding permission with set criteria
        console.log(permissionId);
        this.Permission.findOne({ _id: permissionId })
          .populate('roles', '-__v')
          .exec((err, permission) => {
            if (err) {
              return reject(new Error(err.message));
            }
            if (permission === null) {
              return reject(new Error(__('LOGIN_INVALID_USERNAME_PASSWORD')));
            }
            return resolve(permission);
          });
      } catch (ex) {
        return reject(new Error(ex.message));
      }
    });
  }

  async permissionStore({ name, roles, users }) {
    // Create a Permission object
    //const transaction = await this.transaction.startSession();

    // Create a User object
    const permission = new this.Permission({
      name: name,
      slug: name,
    });

    return new Promise((resolve, reject) => {
      // Save User object in the database
      permission
        .save(permission)
        .then(() => {
          //Check if role is set on submit
          if (roles) {
            //Generate object of roles
            let rolesObj = [];
            for (const role of roles) {
              let roleDetails = this.Role.findOne({ slug: role.role });
              rolesObj.push({
                _id: roleDetails._id,
                name: roleDetails.name,
                read: role.read,
                create: role.create,
                update: role.update,
                delete: role.delete,
              });
            }
            permission.roles = rolesObj;

            //Save & return roles
            permission.save((err) => {
              //Throw error occurs while saving roles
              if (err) {
                return reject(new Error(err.message));
              }
              permission.roles = roles;
            });
          }

          if (users) {
            //Generate object of roles
            let usersObj = [];
            for (const user of users) {
              let userDetails = this.User.findOne({ _id: user.id });
              usersObj.push({
                _id: userDetails._id,
                name: userDetails.name,
                read: user.read,
                create: user.create,
                update: user.update,
                delete: user.delete,
              });
            }
            permission.users = usersObj;

            //Save & return roles
            permission.save((err) => {
              //Throw error occurs while saving roles
              if (err) {
                return reject(new Error(err.message));
              }
              permission.roles = roles;
            });
          }
          //transaction.endSession();
          return resolve(permission);
        })
        .catch((err) => {
          console.log(err);
          return reject(new Error(err.message));
        });
    });
  }

  async updateProfile(profileId, { name, email, phone, roles }) {
    // Create a Permission object
    const permission = new this.Permission({
      name: name,
      email: email,
      phone: phone,
      _id: profileId,
    });
    let permissionId = profileId;
    return new Promise((resolve, reject) => {
      // Save Permission object in the database
      this.Permission.findByIdAndUpdate(
        permissionId,
        { $push: { permission } },
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
            permission.roles = this.Role.find(
              { slug: { $in: roles } },
              (err, roles) => {
                //Throw error occurs when finding roles
                if (err) {
                  return reject(new Error(err.message));
                }

                //Generate object of roles
                permission.roles = roles.map((role) => role._id);

                //Save & return roles
                return permission.save((err) => {
                  //Throw error occurs while saving roles
                  if (err) {
                    return reject(new Error(err.message));
                  }
                  permission.roles = roles;
                  return resolve(permission);
                });
              },
            );
          } else {
            return resolve(permission);
          }
        })
        .catch((err) => {
          return reject(new Error(err.message));
        });
    });
  }
}

module.exports = { permission };
