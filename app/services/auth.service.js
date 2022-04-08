const autoBind = require('auto-bind');
const bcrypt = require('bcryptjs');
const { service } = require('@service/service');
const { generatePassword, generateOTP } = require('../helpers/utility');

class auth extends service {
  /**
   * services constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    super();
    this.User = this.db.User;
    this.Role = this.db.Role;
    this.Token = this.db.Token;
    this.regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    autoBind(this);
  }

  async singup({ name, email, phone, password, roles, verified, status }) {
    const session = await this.transaction.startSession();
    try {
      await session.startTransaction();
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
        status: status ? status : false,
        verified: verified ? verified : false,
      });

      // Save User object in the database
      user.roles = await dbRoles.map((role) => role._id);

      //Save user roles
      await user.save();

      let token = await this.generateToken({
        name: name,
        phone: phone,
        email: email,
      });

      const userToken = await new this.Token({
        user: user._id,
        token: token,
        type: 'ACTIVATION',
        status: true,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      userToken.save();

      /*let mailOptions = {
        to: user.email,
        subject: 'Complete your account registration',
        html: `<h4><b>Hello!</b></h4>
          <p>Thank you for creating your MNodejs Account.</p>
		  <p>We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
          <a href="${this.env.APP_URL}/auth/verify/${user.id}/${token}">
          ${this.env.APP_URL}/auth/verify/${user.id}/${token}
          </a>
          <br><br>
          <p>--Yours truly,<br aria-hidden="true">MNodejs</p>`,
      };
      //this.mailer.send(mailOptions);*/

      //user.roles = roles;
      //user.token = userToken;
      await session.commitTransaction();
      return { user, token: userToken };
    } catch (error) {
      await session.abortTransaction();
      throw new Error(
        error.message ||
          'An error occurred while creating your account. Please try again.',
      );
    } finally {
      session.endSession();
    }
  }

  async verify(userId, token) {
    const transaction = await this.transaction.startSession();

    try {
      await transaction.startTransaction();
      //Finding user with set criteria
      let userCriteria = { _id: userId };
      let userData = await this.User.findOne(userCriteria);

      //Throwing error if user not found
      if (userData === null) {
        throw new Error(
          'We are unable to verify your account. Please try again.1',
        );
      }

      //Throwing error if user already verified
      if (userData.verified === true) {
        throw new Error(
          'Your account already verified your account. Please try to login.',
        );
      }

      //Throwing error if user already active
      if (userData.status === true) {
        throw new Error(
          'Your account already activated your account. Please try to login.',
        );
      }

      //Finding user with set criteria
      var cutoff = new Date();
      let tokenCriteria = {
        user: userData._id,
        token: token,
        status: true,
        type: 'ACTIVATION',
        expiresAt: { $gt: cutoff },
      };
      let tokenDetails = await this.Token.findOne(tokenCriteria);

      if (tokenDetails === null) {
        throw new Error(
          'We are unable to verify your account. Please try again.2',
        );
      }

      let data = {
        status: true,
        verified: true,
      };
      let filter = { _id: userData._id };
      await this.User.updateOne(filter, { $set: data });

      data = {
        status: false,
        expiresAt: new Date(),
        token: null,
      };
      filter = { _id: tokenDetails._id };
      await this.Token.updateOne(filter, { $set: data });

      transaction.commitTransaction();
      return true;
    } catch (error) {
      transaction.abortTransaction();
      throw new Error(
        error.message ||
          'An error occurred while verifying your account. Please try again.',
      );
    }
  }

  async singin({ username, password }) {
    //Setting login criterias
    let criteria = username.match(this.regexEmail)
      ? { email: username }
      : { phone: username };

    try {
      //Finding user with set criteria
      let user = await this.User.findOne(criteria)
        .populate('roles', '-__v')
        .exec();

      if (user === null) {
        throw new Error(
          'We are unable to find your account with the given details.',
        );
      }

      let passwordIsValid = await user.comparePassword(password);
      //const passwordIsValid = await bcrypt.compareSync(password, user.password);

      let blockLoginAttempts = this.env.BLOCK_LOGIN_ATTEMPTS;

      if (!passwordIsValid) {
        let filter = { _id: user._id };
        let data = { loginAttempts: user.loginAttempts + 1 };
        if (user.loginAttempts >= blockLoginAttempts) {
          let blockExpires = new Date(Date.now() + 60 * 5 * 1000);
          data = { ...data, loginAttempts: 0, blockExpires };
        }
        await this.User.updateOne(filter, {
          $set: data,
        });

        if (user.loginAttempts >= blockLoginAttempts) {
          throw new Error(
            'Your login attempts exist. Please try after 300 seconds.',
          );
        } else {
          throw new Error('You have submitted invalid login details.');
        }
      }

      if (user.verified === false) {
        throw new Error(
          'You have not yet verified your account. Please verify your account.',
        );
      }

      if (user.status === false) {
        throw new Error(
          'Your account is in inactive status. Please contact the application administrator.',
        );
      }

      if (user.blockExpires > new Date()) {
        let tryAfter =
          (new Date(user.blockExpires).getTime() - new Date().getTime()) / 1000;
        throw new Error(
          `Your login attempts exist. Please try after ${Math.round(tryAfter)}`,
        );
      }

      const token = await this.generateToken({
        id: user.id,
        phone: user.phone,
        email: user.email,
      });

      const authorities = [];
      for await (const role of user.roles) {
        authorities.push('ROLE_' + role.name.toUpperCase());
      }

      const expiresIn = new Date(
        Date.now() + 60 * this.env.JWT_EXPIRES_IN * 1000,
      );
      if (user.loginAttempts > 0) {
        let filter = { _id: user._id };
        let data = { loginAttempts: 0, blockExpires: new Date() };
        await this.User.updateOne(filter, {
          $set: data,
        });
      }

      const loginRes = {
        user,
        authorities,
        accessToken: token,
        expiresIn,
      };
      return loginRes;
    } catch (error) {
      console.log(error);
      throw new Error(
        error.message ||
          'An error occurred while login into your account. Please try again.',
      );
    }
  }

  async forgotPassword({ username }) {
    //Setting forgot password criterias
    let criteria = username.match(this.regexEmail)
      ? { email: username }
      : { phone: username };

    let field = username.match(this.regexEmail) ? 'email' : 'phone number';

    try {
      //Finding user with set criteria
      const user = await this.User.findOne(criteria)
        .populate('roles', '-__v')
        .exec();

      //Throwing error if user not found
      if (user === null) {
        throw new Error(
          'We are unable to find your account with the given details.',
        );
      }

      //Throwing error if user is not active
      if (user.status === false) {
        throw new Error(
          'Your account has an inactive status. Please contact with administrator.',
        );
      }

      //Throwing error if user is not verified
      if (user.verified === false) {
        throw new Error(
          'Your account has an inactive status. Please contact with administrator.',
        );
      }
      let token = await this.generateToken({
        name: user.name,
        phone: user.phone,
        email: user.email,
      });

      const userToken = new this.Token({
        user: user._id,
        token: token,
        type: 'FORGOT_PASSWORD',
        status: true,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });
      await userToken.save();

      let mailOptions = {
        to: user.email,
        subject:
          'Please follow below instruction to reset your account password',
        html: `<h4><b>Hello!</b></h4>
			  <p>Thank you for creating your MNodejs Account.</p>
			  <p>We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
			  <a href="${this.env.APP_URL}/auth/reset/${user.id}/${token}">
			  ${this.env.APP_URL}/auth/reset/${user.id}/${token}
			  </a>
			  <br><br>
			  <p>--Yours truly,<br aria-hidden="true">MNodejs</p>`,
      };
      await this.mailer.send(mailOptions);

      return true;
    } catch (error) {
      throw new Error(
        error.message ||
          `An error occurred while you are trying to reset your password by ${field}. Please try again.`,
      );
    }
  }
}

module.exports = { auth };
