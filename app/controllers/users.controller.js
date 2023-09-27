'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { user } = require('@service/user.service');
const { baseError } = require('@error/baseError');
const userService = new user('User');
//const roleService = new role('Role');

class usersController extends controller {
  /**
   * Controller constructor
   * @author Ujjwal Bera
   * @param null
   */
  constructor(service) {
    super(service);
    //autoBind(this);
  }
  

  /**
   * @desc create new user
   * @param {*} req
   * @param {*} session
   */
  async createNewCarrierUser(req, session) {
    let { name, email, phone, password, roles } = req.body;      
    let result = await userService.createNewCarrierUser({name, email, phone, password, roles }, session );

    console.log(result);
    if (result) {
      return {
        code: 201,
        result,
        message: 'User created successfully!'
      }
    }
    throw new baseError(
      'Some error occurred while creating your account. Please try again.',
      500
    );
  }

  /**
   * @desc get logged-in user profile
   * @param {*} req
   * @param {*} session
   */
  async profile( req, session ) {
    //console.log(req.user);
    const phone = req?.user?.phone;
    let result = await userService.getProfile(phone, session);
    if (result) {
      return {
        code: 200,
        result,
        message: 'Profile details got successfully!'
      }
    }      
    throw new baseError(
      'Some error occurred while fetching profile details.',
      500
    );
  }

  /**
   * @desc update logged-in user profile
   * @param {*} req
   * @param {*} session
   */
  async updateProfile(req, session ) {
    
      let result = await userService.updateProfile(req.user.id, req.body);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Profile details updated successfully!'));
      }
      
      throw new baseError(
        'Some error occurred while updating profile details.',
        500
      );
  }

  /**
   * @desc change password of logged-in user
   * @param {*} req
   * @param {*} session
   */
  async changePassword(req, session ) {
      let result = await userService.changePassword(req.user.id, req.body);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Profile password updated successfully!'));
      }
      
      throw new baseError(
        'Some error occurred while updating profile password.',
        500
      );
  }

  /**
   * @desc Fetching list of users
   * @param {*} req
   * @param {*} session
   */
  async userList(req, session ) {
      let result = await userService.userList(req.query);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User list got successfully!'));
      }
      
      throw new baseError(
        'Some error occurred while fetching list of users.',
        500
      );
  }

  /**
   * @desc Store a new user
   * @param {*} req
   * @param {*} session
   */
  async userStore(req, session ) {
      let { name, email, phone, password, roles, verified, status } = req.body;
      let result = await userService.userStore(
        name,
        email,
        phone,
        password,
        roles,
        verified,
        status,
      );
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'New user created successfully!'));
      }
      
      throw new baseError(
        'Some error occurred while creating new user.',
        500
      );
  }

  /**
   * @desc Fetch detail of a user
   * @param {*} req
   * @param {*} session
   */
  async userDetails(req, session ) {
      let userId = req.params.id;
      let result = await userService.userDetails(userId);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User details fetched successfully!'));
      }
      
      throw new baseError(
        'Some error occurred while fetching user details.',
        500
      );
  }

  /**
   * @desc Updated a user
   * @param {*} req
   * @param {*} session
   */
  async userUpdate(req, session ) {
      let userId = req.params.id;
      let { name, email, phone, roles, status } = req.body;
      let result = await userService.userUpdate({
        userId,
        name,
        email,
        phone,
        roles,
        status },
        session );
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User details updated successfully!'));
      }
      
      throw new baseError(
        'Some error occurred while updating user details.',
        500
      );
  }

  /**
   * @desc Delete a user
   * @param {*} req
   * @param {*} session
   */
  async userDelete(req, session ) {
      let userId = req.params.id;
      let result = await userService.userDelete(userId, session);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User deleted successfully!'));
      }
      
      throw new baseError(
        'Some error occurred while deleting user.',
        500
      );
  }
}
module.exports = new usersController(userService);
