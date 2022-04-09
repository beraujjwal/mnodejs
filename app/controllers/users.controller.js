'use strict';
const autoBind = require('auto-bind');

const { controller } = require('./controller');
const { user } = require('@service/user.service');
//const { role } = require('@service/role.service');
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
    this.service = service;
    //this.roleService = roleService;
    autoBind(this);
  }

  /**
   * @desc get logged-in user profile
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async profile(req, res, next) {
    try {
      let result = await this.service.getProfile(req.user.id);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Profile details got successfully!'));
      }
      next('Some error occurred while fetching profile details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc update logged-in user profile
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async updateProfile(req, res, next) {
    try {
      console.log('In Controller');
      let result = await this.service.updateProfile(req.user.id, req.body);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Profile details updated successfully!'));
      }
      next('Some error occurred while updating profile details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc change password of logged-in user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async changePassword(req, res, next) {
    try {
      let result = await this.service.changePassword(req.user.id, req.body);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'Profile password updated successfully!'));
      }
      next('Some error occurred while updating profile password.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Fetching list of users
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async userList(req, res, next) {
    try {
      let result = await this.service.userList(req.query);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User list got successfully!'));
      }
      next('Some error occurred while fetching list of users.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Store a new user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async userStore(req, res, next) {
    try {
      let { name, email, phone, password, roles, verified, status } = req.body;
      let result = await this.service.userStore(
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
      next('Some error occurred while creating new user.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Fetch detail of a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async userDetails(req, res, next) {
    try {
      let userId = req.params.id;
      let result = await this.service.userDetails(userId);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User details fetched successfully!'));
      }
      next('Some error occurred while fetching user details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Updated a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async userUpdate(req, res, next) {
    try {
      let userId = req.params.id;
      let { name, email, phone, roles, status } = req.body;
      let result = await this.service.userUpdate(
        userId,
        name,
        email,
        phone,
        roles,
        status,
      );
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User details updated successfully!'));
      }
      next('Some error occurred while updating user details.');
    } catch (err) {
      next(err);
    }
  }

  /**
   * @desc Delete a user
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async userDelete(req, res, next) {
    try {
      let userId = req.params.id;
      let result = await this.service.userDelete(userId);
      if (result) {
        return res
          .status(200)
          .json(this.success(result, 'User deleted successfully!'));
      }
      next('Some error occurred while deleting user.');
    } catch (err) {
      next(err);
    }
  }
}
module.exports = new usersController(userService);
