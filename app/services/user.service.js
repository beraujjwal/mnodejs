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
    try {
      let profileDetails = await this.User.findById(profileId)
        .populate({
          path: 'roles',
          populate: [
            {
              path: 'permissions',
              model: 'Permission',
            },
          ],
        })
        .exec();

      if (!profileDetails) {
        throw new Error('User profile not found!.');
      }
      return profileDetails;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateProfile(profileId, { name, email, phone, roles }) {
    try {
      let profileDetails = await this.User.findById(profileId)
        .populate({
          path: 'roles',
          populate: [
            {
              path: 'permissions',
              model: 'Permission',
            },
          ],
        })
        .exec();

      if (!profileDetails) {
        throw new Error('User profile not found!.');
      }
      let { __v, _id, ...newProfileDetails } = profileDetails;
      let data = newProfileDetails._doc;

      if (name != null) {
        data.name = name;
      }
      if (email != null) {
        data.email = email;
      }
      if (phone != null) {
        data.phone = phone;
      }

      if (roles) {
        //Find selected role
        let userRoles = await this.Role.find({ slug: { $in: roles } });

        //Generate object of roles
        data.roles = userRoles.map((role) => role._id);
      }

      // Removing below data from main object
      delete data.__v;
      delete data._id;
      delete data.password;
      delete data.updatedAt;
      delete data.createdAt;

      let filter = { _id: _id };
      await this.User.updateOne(filter, { $set: data });
      return data;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

module.exports = { user };
