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

  async userList(queries) {
    try {
      let {
        keyword = null,
        orderby = 'name',
        ordering = 'asc',
        limit = 10,
        skip = 0,
      } = queries;
      let filter = { deleted: false };
      if (keyword != null && keyword.length > 0) {
        filter = { ...filter, name: new RegExp(keyword, 'i') };
      }
      let order = 1;
      if (ordering == 'desc') {
        order = -1;
      }

      return await this.User.find(filter)
        .sort({ [orderby]: order })
        .limit(parseInt(limit))
        .skip(parseInt(skip));
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async userStore(name, email, phone, password, roles, status) {
    try {
      if (!roles) {
        roles = ['subscriber']; // if role is not selected, setting default role for new user
      }
      let dbRoles = await this.Role.find({ slug: { $in: roles } });
      if (dbRoles.length < 1) {
        throw new Error('You have selected an invalid role.');
      }

      // Create a User object
      const user = await new this.User({
        name: name,
        email: email,
        phone: phone,
        password: password, //bcrypt.hashSync(password, 8),
        status: status ? status : true,
        verified: true,
      });
      // Save User object in the database
      user.roles = await dbRoles.map((role) => role._id);

      //Save user roles
      await user.save();

      /*let mailOptions = {
        to: user.email,
        subject: 'Complete your account registration',
        html: `<h4><b>Hello!</b></h4>
          <p>Thank you for join MNodejs</p>
		  <p>We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
          <a href="${this.env.APP_URL}/auth/verify/${user.id}/${token}">
          ${this.env.APP_URL}/auth/verify/${user.id}/${token}
          </a>
          <br><br>
          <p>--Yours truly,<br aria-hidden="true">MNodejs</p>`,
      };
      //this.mailer.send(mailOptions);*/

      return user;
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async userDetails(userId) {
    try {
      let user = await this.User.findOne({
        _id: userId,
        deleted: false,
      });
      if (!user) {
        throw new Error('User not found with this given details.');
      }
      return user;
    } catch (ex) {
      throw new Error(ex.message);
    }
  }

  async userUpdate(userId, name, email, phone, roles, status) {
    try {
      let user = await this.User.findOne({
        _id: userId,
        deleted: false,
      });
      if (!user) {
        throw new Error('User not found.');
      }
      if (!roles) {
        roles = ['subscriber']; // if role is not selected, setting default role for new user
      }
      let dbRoles = await this.Role.find({ slug: { $in: roles } });
      if (dbRoles.length < 1) {
        throw new Error('You have selected an invalid role.');
      }

      let data = user._doc;

      if (name != null) {
        data.name = name;
      }

      if (email != null) {
        data.email = email;
      }

      if (phone != null) {
        data.phone = phone;
      }

      if (status != null) {
        data.status = status;
      }

      if (roles != null) {
        data.roles = await dbRoles.map((role) => role._id);
      }

      // Removing below data from main object
      delete data.__v;
      delete data._id;
      delete data.updatedAt;
      delete data.createdAt;

      let filter = { _id: userId };
      await this.User.updateOne(filter, { $set: data });

      return await this.User.findOne({
        _id: userId,
        deleted: false,
      });
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }

  async userDelete(userId) {
    try {
      let user = await this.User.findOne({
        _id: userId,
        deleted: false,
      });
      if (!user) {
        throw new Error('User not found.');
      }

      await user.delete();

      return await this.User.findOne({
        _id: userId,
        deleted: true,
      });
    } catch (ex) {
      console.log(ex);
      throw new Error(ex.message);
    }
  }
}

module.exports = { user };
