const autoBind = require('auto-bind');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { service } = require('@service/service');
const { token } = require('@service/token.service');
const { role } = require('@service/role.service');
const { baseError } = require('@error/baseError');
const redisClient = require('../../libraries/redis.library');
const tokenService = new token('Token');
const roleService = new role('Role');
const userGraph = require('../../neo4j/services/user');

const { sentOTPMail } = require('../../libraries/email.library');
const { sentOTPSMS } = require('../../libraries/sms.library');

class user extends service {
  /**
   * user service constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(model) {
    super(model);
    this.model = this.db[model];
    this.role = this.db['Role'];
    this.token = this.db['Token'];
    this.regexEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    autoBind(this);
  }

  async createNewCarrierUser({ name, email, phone, password, roles, verified = false, status = false }, session) {
    try {
        const dbRoles = await roleService.checkUserRoleAvailablity({roles, parentRole: 'carrier', defaultRole: 'carrier-driver'}, session);

        const user = await this.model.create([{
          name,
          email,
          phone: phone,
          password, //bcrypt.hashSync(password, 8),
          status,
          verified,
          deviceId: null,
          deviceType: null,
          fcmToken: null,
          roles: dbRoles.map((role) => role._id),
        }], { session: session });
        const userId = user[0].id;
        const userToken = await tokenService.createToken({
          user: userId,
          type: 'ACTIVATION',
          sentOn: email
        }, session);

        userGraph.create(user[0]);
        return { user: user[0]._id, roles: user[0].roles };
    } catch (ex) {
      console.log(ex);
      throw new baseError(
        ex.message || 'An error occurred while creating your account. Please try again.',
        ex.status
      );
    }
  }

  async singup({name, email, phone, password, roles, status = false, verified = false, deviceId = null, deviceType = null, fcmToken = null,}, session) {
    try {

      const dbRoles = await roleService.checkUserRoleAvailablity({roles, parentRole: 'agent', defaultRole: 'testrole'}, session);

        const user = await this.model.create([{
          name,
          email,
          phone,
          password, //bcrypt.hashSync(password, 8),
          status,
          verified,
          deviceId,
          deviceType,
          fcmToken,
          roles: dbRoles.map((role) => role._id),
        }], { session });

        const userId = user[0]._id;
        const userEmail = user[0].email;
        const userToken = await tokenService.createToken({
          user: userId,
          type: 'ACTIVATION',
          sentOn: userEmail
        }, session);
        const data = { user, email, phone };
        //await this.kafkaProducer('carrier-signup', data);

        userGraph.create(user[0]);

        if(!email){
          sentOTPSMS(phone, userToken.token);
        } else {
          sentOTPMail(email, userToken.token);
        }
        return { user, token: userToken };
    } catch (ex) {
      console.log('user service', ex);
      throw new baseError(ex, ex?.code );
    }
  }

  async verify(username, token) {


    try {


      let criteria = username.match(this.regexEmail)
      ? { email: username }
      : { phone: username };

      let userData = await this.model.findOne(criteria);

      //Throwing error if user not found
      if (userData === null) {
        throw new baseError('We are unable to verify your account. Please try again.', 403);
      }

      //Throwing error if user already verified
      if (userData.verified === true) {
        throw new baseError(
          'Your account already verified your account. Please try to login.',
        );
      }

      //Throwing error if user already active
      if (userData.status === true) {
        throw new baseError(
          'Your account already activated your account. Please try to login.',
        );
      }

      //Finding user with set criteria
      let cutoff = moment().utc(this.env.APP_TIMEZONE).toDate();
      let tokenCriteria = {
        user: userData._id,
        token: token,
        status: true,
        type: 'ACTIVATION',
        expiresAt: { $gt: cutoff },
      };
      let tokenDetails = await this.token.findOne(tokenCriteria);

      if (tokenDetails === null) {
        throw new baseError(
          'We are unable to verify your account. Please try again.2',
        );
      }

      let verify = username.match(this.regexEmail) ? 'isEmailVerified'   : 'isPhoneVerified';

      let data = {
        status: true,
        verified: true,
        [verify]: true
      };
      let filter = { _id: userData._id };
      await this.model.updateOne(filter, { $set: data });

      data = {
        status: false,
        expiresAt: moment().utc(this.env.APP_TIMEZONE).toDate(),
        token: null,
      };
      filter = { _id: tokenDetails._id };
      await this.token.updateOne(filter, { $set: data });

      return true;
    } catch (error) {
      throw new baseError(
        error.message || 'An error occurred while verifying your account. Please try again.',
        error.status
      );

    }
  }

  async login(
    { username, password },
    { device_id, device_type, fcm_token }
    ) {

    const session = await this.db.trans.startSession();
    try {

      //Finding user with set criteria
      let user = await this.getUserDetailsByUsername(username);

      if (!user) {
        await this.UnauthorizedError(
            'We are unable to find your account with the given credentials.123',
        );
      }

      await this.blockLoginAttempts(user.blockExpires);

      //let passwordIsValid = await user.comparePassword(password);
      let passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        await this.invalidLoginAttempt(user);
      }

      await this.isVerifiedUser(user);
      await this.isActivedUser(user);

      const roles = [];
      for await (const role of user.roles) {
        roles.push(role.slug);
      }

      let tokenSalt = await this.generateOTP(6, {digits: true,});
      const accessToken = await this.generateAccessToken(user._id, user.phone, user.email, tokenSalt )

      let filter = { _id: user._id };
      let data = {
        loginAttempts: 0,
        tokenSalt: tokenSalt,
        blockExpires: moment().utc(this.env.APP_TIMEZONE).toDate(),
        deviceId: device_id,
        deviceType: device_type,
        fcmToken: fcm_token
      };

      await this.model.updateOne(filter, {
        $set: data,
      });

      delete user.password;
      const userWithLatestData = { ...user, ...data }
      const loginRes = {
        user: userWithLatestData,
        roles,
        accessToken,
      };

      redisClient.set(user._id, JSON.stringify(loginRes), this.env.JWT_EXPIRES_IN);
      return loginRes;
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while login into your account. Please try again.',
        ex.status ?? 500
      );
    } finally {
      session.endSession();
    }
  }

  async otpVerify(
      { username, otp },
      { device_id, device_type, fcm_token }
    ) {

    try {
      //Finding user with set criteria

      let user = await this.getUserDetailsByUsername(username);

      if (!user) {
        throw new baseError(
          'We are unable to find your account with the given details.',
        );
      }
      let otpType = 'SIGNUP';
      if(user.isCompleted) {
        otpType = 'SIGNIN'
      }

      const userToken = await tokenService.findOtp(user._id, otp, otpType, username);

      let blockLoginAttempts = this.env.BLOCK_LOGIN_ATTEMPTS;

      if(!userToken) {
        await this.invalidLoginAttempt(user);
      }

      await this.blockLoginAttempts(user);

      if(user.isCompleted) {
        await this.isVerifiedUser(user);
        await this.isActivedUser(user);
      }


      let tokenSalt = await this.generateOTP(6, {
        digits: true,
      });

      const token = await this.generateToken({
        id: user._id,
        tokenSalt: tokenSalt,
        isCompleted: user.isCompleted
      });

      const authorities = [];
      for await (const role of user.roles) {
        authorities.push(role.slug);
      }

      const expiresIn = new Date(
        Date.now() + 60 * this.env.JWT_EXPIRES_IN * 1000,
      );

      //if (user.loginAttempts > 0) {
      let userFilter = { _id: user._id };
      let userData = {
        loginAttempts: 0,
        tokenSalt: tokenSalt,
        blockExpires: new Date(),
        deviceId: device_id,
        deviceType: device_type,
        fcmToken: fcm_token,
        verified: true,
        status: true
      };
      username.match(this.regexEmail) ? userData.isEmailVerified = true : userData.isPhoneVerified = true;
      await this.model.updateOne(userFilter, {
        $set: userData,
      });

      //}

      tokenService.deactiveOtp(userToken._id);

      const loginRes = {
        user,
        authorities,
        accessToken: token,
        expiresIn,
      };
      return loginRes;
    } catch (ex) {
      console.debug('ex---', ex)
      throw new baseError(
        ex.message || 'An error occurred while login into your account. Please try again.',
        ex.status
      );
    }
  }

  async emailVerify( email, otp ) {

    try {
      const user = await this.contactVerify( email, otp );

      if(!user) {
        throw new baseError(
          'No user found with this email.',
        );
      }
      let userFilter = { _id: user._id };
      let userData = {
        isEmailVerified: true
      };
      await this.model.updateOne(userFilter, {
        $set: userData,
      });
      user.isEmailVerified = true;
      return user;
    } catch (ex) {
      console.debug('ex=>', ex)
      throw new baseError(
        ex.message || 'An error occurred while verifying your e-mail address. Please try again.',
        ex.status
      );
    }
  }

  async phoneVerify( phone, otp ) {

    try {
      const user = await this.contactVerify( phone, otp );
      let userFilter = { _id: user._id };
      let userData = {
        isPhoneVerified: true
      };
      await this.model.updateOne(userFilter, {
        $set: userData,
      });
      user.isPhoneVerified = true;
      return user;
      return user;
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while verifying your phone number. Please try again.',
        ex.status
      );
    }
  }

  async contactVerify( username, otp ) {

    try {

      console.debug('contactVerify=', username)
      //Finding user with set criteria
      let user = await this.getUserDetailsByUsername(username);

      if (!user) {
        throw new baseError(
          'We are unable to find your account with the given details.',
        );
      }

      const verify = await tokenService.findOtp(user._id, otp, 'VERIFY', username);

      if(!verify) {
        throw new baseError(
          'Invalid verification token.',
        );
      }

      tokenService.deactiveOtp(verify._id);

      return user;

    } catch (ex) {
      console.debug('ex=>', ex)
      throw new baseError(
        ex.message || 'An error occurred while verifying your account. Please try again.',
        ex.status
      );
    }
  }

  async otpResend( username, type ) {

    try {
      //Finding user with set criteria
      let user = await this.getUserDetailsByUsername(username);

      if (!user) {
        throw new baseError(
          'We are unable to find your account with the given details.',
        );
      }

      const token = await tokenService.findUpdateOrCreate(user._id, type, username)

      return token;
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while login into your account. Please try again.',
        ex.status
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
      const user = await this.model
        .findOne(criteria)
        .populate('roles', '-__v')
        .exec();

      //Throwing error if user not found
      if (!user) {
        throw new baseError(
          'We are unable to find your account with the given details.',
        );
      }

      //Throwing error if user is not active
      if (user.status === false) {
        throw new baseError(
          'Your account has an inactive status. Please contact with administrator.',
        );
      }

      //Throwing error if user is not verified
      if (user.verified === false) {
        throw new baseError(
          'Your account has an inactive status. Please contact with administrator.',
        );
      }

      const userToken = await tokenService.createToken(user._id, 'FORGOT_PASSWORD', username);

      let isEmail = username.match(this.regexEmail) ? true : false;
      if(!isEmail){
        const message = `Your OTP for reset password is ${userToken.token}`;
        await this.sentSMS(username, message);
      } else {
        await this.sentOTPMail(username, userToken.token);
      }

      return userToken;
    } catch (ex) {
      throw new baseError(
        ex.message || `An error occurred while you are trying to reset your password by ${field}. Please try again.`,
        ex.status
      );
    }
  }

  async resetPassword({ username, otp, password }) {
    //Setting forgot password criterias
    let criteria = username.match(this.regexEmail)
      ? { email: username }
      : { phone: username };

    let field = username.match(this.regexEmail) ? 'email' : 'phone number';

    try {
      //Finding user with set criteria
      const user = await this.model
        .findOne(criteria)
        .populate('roles', '-__v')
        .exec();

      //Throwing error if user not found
      if (!user) {
        throw new baseError(
          'We are unable to find your account with the given details.',
        );
      }

      //Throwing error if user is not active
      if (user.status === false) {
        throw new baseError(
          'Your account has an inactive status. Please contact with administrator.',
        );
      }

      //Throwing error if user is not verified
      if (user.verified === false) {
        throw new baseError(
          'Your account has an inactive status. Please contact with administrator.',
        );
      }

      let resetToken = await this.token.findOne({
        user: user._id,
        token: otp
      }).exec();

      if (!resetToken) {
        throw new baseError(
          'Invalid OTP.',
        );
      }

      let data = {
        status: false,
        expiresAt: new Date(),
        token: null,
      };
      let filter = { _id: resetToken._id };
      await this.token.updateOne(filter, { $set: data });

      let salt = await bcrypt.genSalt(this.env.SALT_FACTOR);
      let hashPassword = await bcrypt.hash( password, salt );

      let tokenSalt = await this.generateOTP(6, {
        digits: true,
      });

      let userFilter = { _id: user._id };
      let userData = {
        password: hashPassword,
        blockExpires: new Date(),
        tokenSalt: tokenSalt
      };
      await this.model.updateOne(userFilter, {
        $set: userData,
      });

      return true;
    } catch (ex) {
      throw new baseError(
        ex.message || `An error occurred while you are trying to reset your password by ${field}. Please try again.`,
        ex.status
      );

    }
  }

  async getProfile(phone) {
    try {

      let user = await this.getUserDetailsByUsername(String(phone));
      if (!user) {
        await this.NotFoundError(
          `User profile not found!.`
        );
      }

      return user;
    } catch (ex) {
      console.debug('ex', ex)
      throw new baseError(
        ex.message || `User profile not found!.`,
        ex.status
      );
    }
  }

  async updateProfile(profileId, { name, email, phone, profile, address }) {
    try {
      const profileDetails = await this.model
        .findById(profileId)
        .populate('roles', '-__v')
        .exec();

      if (!profileDetails) {
        throw new baseError('User profile not found!.');
      }

      let responseObj = {};

      let newData = {};
      //If data is not null then set in updated object
      if(name)
        newData = { ...newData, name };
      if(email)
        newData = { ...newData, email };
      if(phone)
        newData = { ...newData, phone };
      if(profile)
        newData = { ...newData, profile };
      if(address)
        newData = { ...newData, address };


      if(profileDetails.isCompleted === false) {

        newData = { ...newData, isCompleted: true }
        let tokenSalt = await this.generateOTP(6, {
          digits: true,
        });
        newData = { ...newData, tokenSalt: tokenSalt }

        const token = await this.generateToken({
          id: profileDetails.id,
          tokenSalt: tokenSalt,
          isCompleted: true
        });

        const authorities = [];
        for await (const role of profileDetails.roles) {
          authorities.push(role.slug);
        }

        const expiresIn = new Date(
          Date.now() + 60 * this.env.JWT_EXPIRES_IN * 1000,
        );

        responseObj.accessToken = token;
        responseObj.authorities = authorities;
        responseObj.expiresIn = expiresIn;

      }

      responseObj.user = await this.getUserDetailsByUsername(String(profileDetails.phone));

      return responseObj;

    } catch (ex) {
      console.debug('ex=>', ex)
      throw new baseError(
        ex.message || `We have facing some error when updating your profile.`,
        ex.status
      );
    }
  }

  async changePassword(
    profileId,
    { old_password, password, password_confirmation },
  ) {
    try {
      if (old_password == password) {
        throw new baseError(
          'Old password & new password is same. Please try different password.',
        );
      }
      if (password !== password_confirmation) {
        throw new baseError(
          'New password & password confirmation is not matching.',
        );
      }
      const user = await this.model.findById(profileId);

      if (!user) {
        throw new baseError('User profile not found!.');
      }
      const passwordIsValid = await bcrypt.compareSync(
        old_password,
        user.password,
      );
      if (!passwordIsValid) {
        throw new baseError('Old massword not matching.');
      }

      let salt = await bcrypt.genSalt(this.env.SALT_FACTOR);
      let hashPassword = await bcrypt.hash( password, salt );

      let tokenSalt = await this.generateOTP(6, {
        digits: true,
      });

      let data = {
        tokenSalt, password: hashPassword
      }

      let filter = { _id: profileId };
      await this.model.updateOne(filter, { $set: data });
      return data;
    } catch (err) {
      throw new baseError(err.message);
    }
  }

  async userList(queries) {
    try {
      let {
        keyword = null,
        role = 'editor',
        orderby = 'order',
        ordering = 'asc',
        limit = 10,
        page = 0,
      } = queries;
      let filter = { deleted: false };
      if (keyword != null && keyword.length > 0) {
        filter = { ...filter, name: new RegExp(keyword, 'i') };
      }
      let order = 1;
      if (ordering == 'desc') {
        order = -1;
      }
      let skip = parseInt(page) * parseInt(limit) - parseInt(limit);

      const result = await this.model.aggregate([
        {
          $match : filter
        },
        {
            $lookup: {
                from: 'roles',
                localField: 'roles',
                foreignField: '_id',
                as: 'Role'
            }
        },
        // filter
        {
            $match: {
                'Role.slug': role,
            }
        },
        {
          $facet: {
            items: [
              { $skip: +skip }, { $limit: +limit}
            ],
            total: [
              {
                $count: 'count'
              }
            ]
          }
        }
      ]);

      return result[0];

    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async userStore(name, email, phone, password, roles, status) {
    try {
      if (!roles) {
        roles = ['subscriber']; // if role is not selected, setting default role for new user
      }
      let dbRoles = await this.role.find({ slug: { $in: roles } });
      if (dbRoles.length < 1) {
        throw new baseError('You have selected an invalid role.');
      }

      // Create a User object
      const user = await new this.model({
        name: name,
        email: email,
        phone: phone,
        password: password, //bcrypt.hashSync(password, 8),
        status: status ?? true,
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
      throw new baseError(ex);
    }
  }

  async userDetails(userId) {
    try {
      let user = await this.model.findOne({
        _id: userId,
        deleted: false,
      }).populate('roles', 'slug');

      if(user.roles[0].slug == "student") {
        user = await this.studentDetails(userId);
      }

      if (!user) {
        throw new baseError('User not found with this given details.');
      }
      return user;
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async studentDetails(userId) {
    try {

      let filter = { deleted: false };

      if(userId) {
        filter = { ...filter, _id: userId };
      }

      let countryLoopup = {
        from: "countries",
        localField: "address.country",
        foreignField: "_id",
        as: "userCountry",
        pipeline: [
          {
            $match: {
              deleted: false,

            }
          },
          {
            $project: {
              _id: true,
              name: true,
            }
          }
        ]
      };

      let stateLoopup = {
        from: "states",
        localField: "address.state",
        foreignField: "_id",
        as: "userState",
        pipeline: [
          {
            $match: {
              deleted: false,
            }
          },
          {
            $project: {
              _id: true,
              name: true,
            }
          }
        ]
      };

      let cityLoopup = {
        from: "cities",
        localField: "address.city",
        foreignField: "_id",
        as: "userCity",
        pipeline: [
          {
            $match: {
              deleted: false,
            }
          },
          {
            $project: {
              _id: true,
              name: true,
            }
          }
        ]
      }

      let courseLoopup = {
        from: "studentcourses",
        localField: "_id",
        foreignField: "user",
        pipeline: [
          {
            $match: {
              deleted: false,
            }
          },
          {
            $lookup: {
              from: "courses",
              localField: "course",
              foreignField: "_id",
              as: "course"
            }
          }
        ],
        as: "studentCourses",
      }

      let user = await this.model
          .aggregate([
            {
              $lookup: {
                ...countryLoopup
              }
            },
            {
              $lookup: {
                ...stateLoopup
              }
            },
            {
              $lookup: {
                ...cityLoopup
              }
            },
            {
              $lookup: {
                ...courseLoopup
              }
            },
            {
              $unwind: {
                path: {
                  path: '$userCountry',
                  preserveNullAndEmptyArrays: true
                }
              }
            },
            /*{
              $unwind: {
                  path: '$userState',
                  preserveNullAndEmptyArrays: true
                }
            },
            {
              $unwind: {
                  path: '$userCity',
                  preserveNullAndEmptyArrays: true
                }
            },
            {
              $unwind: {
                  path: '$studentCourses',
                  preserveNullAndEmptyArrays: true
                }
            },*/
            {
              $match: filter
            },
            { $limit: 1 }
          ])
          .exec();


      if (!user) {
        throw new baseError('User not found with this given details.');
      }
      return user;
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async userUpdate({
    userId,
    name,
    email,
    phone,
    roles,
    status },
    session) {
    try {
      let user = await this.model.findOne({
        _id: userId,
        deleted: false,
      });
      if (!user) {
        throw new baseError('User not found.');
      }
      if (!roles) {
        roles = ['subscriber']; // if role is not selected, setting default role for new user
      }
      let dbRoles = await this.role.find({ slug: { $in: roles } });
      if (dbRoles.length < 1) {
        throw new baseError('You have selected an invalid role.');
      }

      const data = { name, email, phone, roles, status }

      let filter = { _id: userId };
      await this.model.updateOne(filter, { $set: data }, { session });

      return await this.model.findOne({
        _id: userId,
        deleted: false,
      });
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async userDelete(userId, session) {
    try {
      let user = await this.model.findOne({
        _id: userId,
        deleted: false,
      });
      if (!user) {
        throw new baseError('User not found.');
      }

      await user.delete({ session });

      return await this.model.findOne({
        _id: userId,
        deleted: true,
      });
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async getUserDetailsByUsername(username){
    try{

      let filter = username.match(this.regexEmail) ? { email: username, isEmailVerified: true, deleted: false } : { phone: username, isPhoneVerified: true, deleted: false };

      // return await this.model
      //   .findOne(criteria)
      //   .populate('roles', '-__v')
      //   .exec();

      let countryLoopup = {
        from: "countries",
        localField: "address.country",
        foreignField: "_id",
        as: "address.country",
        pipeline: [
          {
            $match: {
              deleted: false,

            }
          },
          {
            $project: {
              _id: true,
              name: true,
            }
          }
        ]
      };

      let stateLoopup = {
        from: "states",
        localField: "address.state",
        foreignField: "_id",
        as: "address.state",
        pipeline: [
          {
            $match: {
              deleted: false,
            }
          },
          {
            $project: {
              _id: true,
              name: true,
            }
          }
        ]
      };

      let cityLoopup = {
        from: "cities",
        localField: "address.city",
        foreignField: "_id",
        as: "address.city",
        pipeline: [
          {
            $match: {
              deleted: false,
            }
          },
          {
            $project: {
              _id: true,
              name: true,
            }
          }
        ]
      }

      let roleLoopup = {
        from: "roles",
        localField: "roles",
        foreignField: "slug",
        as: "roles",
        pipeline: [
          {
            $match: {
              deleted: false,
            }
          },
          {
            $project: {
              _id: true,
              name: true,
              slug: true,
              rights: true
            }
          }
        ]
      }

      const user = await this.model
        .aggregate([
          {
            $match: filter
          },
          {
            $lookup: {
              ...countryLoopup
            }
          },
          {
            $lookup: {
              ...stateLoopup
            }
          },
          {
            $lookup: {
              ...cityLoopup
            }
          },
          {
            $lookup: {
              ...roleLoopup
            }
          },
          {
            $unwind: {
              path: "$address.country",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $unwind: {
              path: "$address.state",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $unwind: {
              path: "$address.city",
              preserveNullAndEmptyArrays: true
            }
          },
          { $limit: 1 }
        ]);

      if(user[0]?.profile?.dob) {
        user[0].profile.dob = moment(user[0].profile.dob).format('YYYY-MM-DD');
      }
      return user[0];

    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred fetching user details. Please try again.',
        ex.status
      );
    }

  }

  async isValidUser(user){

    if (!user) {
      throw new baseError(
        'We are unable to verify your account. Please try again.1',
      );
    }
    return true;
  }

  async isVerifiedUser(user){
    if (user.verified === false) {
      throw new baseError(
        'You have not yet verified your account. Please verify your account.',
      );
    }
    return true;
  }

  async isActivedUser(user){

    if (user.status === false) {
      throw new baseError(
        'Your account is in inactive status. Please contact the application administrator.',
      );
    }
    return true;
  }

  async storeUserTokenInTokenModel(userId, token, type, sentOn){

    let isEmail = sentOn.match(this.regexEmail) ? true : false;
    let sentTo = 'phone';

    if(isEmail) {
      sentTo = 'email';
    }

    this.token.updateMany({ user: userId }, { $set: { expiresAt: new Date() } });

    let userToken = await new this.token({
      user: userId,
      token: token,
      type: type,
      sent_to: sentTo,
      sent_on: sentOn,
      status: true,
      expiresAt: new Date(Date.now() + 60 * 5 * 1000),
    });

    await userToken.save();
    return userToken;

  }

  async userUpdateStatus(userId)
  {
    try {
      let user = await this.model.findOne({
        _id: userId,
        deleted: false,
      });
      if (!user) {
        throw new baseError('User not found.');
      }

      let data = user._doc;

      data.status = !data.status;

      // Removing below data from main object
      delete data.__v;
      delete data._id;
      delete data.updatedAt;
      delete data.createdAt;

      let filter = { _id: userId };
      await this.model.updateOne(filter, { $set: data });

      return await this.model.findOne({
        _id: userId,
        deleted: false,
      });
    } catch (ex) {
      throw new baseError(ex);
    }
  }

  async invalidLoginAttempt(user) {
    try {
      let blockLoginAttempts = parseInt(this.env.BLOCK_LOGIN_ATTEMPTS);
      const loginAttempts = user?.loginAttempts ? parseInt(user.loginAttempts) : 0;
      let filter = { _id: user._id };
      let data = { loginAttempts: loginAttempts + 1 };
      if (loginAttempts >= blockLoginAttempts) {
        let blockExpires = new Date(Date.now() + 60 * 5 * 1000);
        data = { ...data, loginAttempts: 0, blockExpires };
      }
      await this.model.updateOne(filter, {
        $set: data,
      });

      console.log(`loginAttempts${loginAttempts}-> >= blockLoginAttempts${blockLoginAttempts}`)
      if (loginAttempts >= blockLoginAttempts) {
        throw new baseError(
          'Your login attempts exist. Please try after 300 seconds.',
        );
      } else {
        await this.UnauthorizedError('You have submitted invalid login details.');
      }
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while validating your Login Attempt.',
        ex.status
      );
    }
  }

  async blockLoginAttempts(blockExpires) {
    try {
      const currentDateTime = moment().utc(this.env.APP_TIMEZONE).toDate();
      if (blockExpires > currentDateTime) {
        let tryAfter = (new Date(blockExpires).getTime() - new Date(currentDateTime).getTime()) / 1000;
        throw new baseError(
          `Your login attempts exist. Please try after ${Math.round(
            tryAfter,
          )} seconds`,
        );
      }
    } catch (ex) {
      throw new baseError(
        ex.message || 'An error occurred while blocking your Login Attempt.',
        ex.status
      );
    }
  }

  async userCount() {
        let role = 'student';
        let active_filter = { deleted: false, status:true};
        let inactive_filter = { deleted: false, status:false};
        let active_count = 0;
        let inactive_count = 0;


        const active_record = await this.model.aggregate([
          {
            $match : active_filter
          },
          {
              $lookup: {
                  from: 'roles',
                  localField: 'roles',
                  foreignField: '_id',
                  as: 'Role'
              }
          },
          {
              $match: {
                  'Role.slug': role,
              }
          },
          {
            $count: 'record_no'
          }
        ]);


        const inactive_record = await this.model.aggregate([
          {
            $match : inactive_filter
          },
          {
              $lookup: {
                  from: 'roles',
                  localField: 'roles',
                  foreignField: '_id',
                  as: 'Role'
              }
          },
          {
              $match: {
                  'Role.slug': role,
              }
          },
          {
            $count: 'record_no'
          }
        ]);


        if(active_record[0])
        {
          active_count = active_record[0].record_no;
        }

        if(inactive_record[0])
        {
          inactive_count = inactive_record[0].record_no;
        }

        return {active_count:active_count, inactive_count:inactive_count};
  }

}

module.exports = { user };