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
    this.service = userService;
    //this.roleService = roleService;
    autoBind(this);
  }

  /**
   * @desc get logged-in user profile
   * @param {*} req
   * @param {*} res
   */
  async profile(req, res) {
    try {
      let result = await this.service.getProfile(req.user.id);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Profile details got successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching your profile details.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message ||
          'Some error occurred while fetching your profile details.',
      );
    }
  }

  /**
   * @desc update logged-in user profile
   * @param {*} req
   * @param {*} res
   */
  async updateProfile(req, res) {
    try {
      let result = await this.service.updateProfile(req.user.id, req.body);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Profile details updated successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while updating your profile details.',
        );
      }
    } catch (err) {
      console.log(err);
      this.ApiRes.errorResponse(
        res,
        err.message ||
          'Some error occurred while updating your profile details.',
      );
    }
  }

  /**
   * @desc change password of logged-in user
   * @param {*} req
   * @param {*} res
   */
  async changePassword(req, res) {
    try {
      let result = await this.service.changePassword(req.user.id, req.body);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'Profile password updated successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while updating your profile password.',
        );
      }
    } catch (err) {
      console.log(err);
      this.ApiRes.errorResponse(
        res,
        err.message ||
          'Some error occurred while updating your profile password.',
      );
    }
  }

  /**
   * @desc Fetching list of users
   * @param {*} req
   * @param {*} res
   */
  async userList(req, res) {
    try {
      let result = await this.service.userList(req.query);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'User list got successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching list of users.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while fetching list of users.',
      );
    }
  }

  /**
   * @desc Store a new user
   * @param {*} req
   * @param {*} res
   */
  async userStore(req, res) {
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
        this.ApiRes.successResponseWithData(
          res,
          result,
          'User details stored successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while storing user.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while storing user.',
      );
    }
  }

  /**
   * @desc Fetch detail of a user
   * @param {*} req
   * @param {*} res
   */
  async userDetails(req, res) {
    try {
      let userId = req.params.id;
      let result = await this.service.userDetails(userId);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'User details fetched successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while fetching user.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while fetching user.',
      );
    }
  }

  /**
   * @desc Updated a user
   * @param {*} req
   * @param {*} res
   */
  async userUpdate(req, res) {
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
        this.ApiRes.successResponseWithData(
          res,
          result,
          'User details updated successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while updating user.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while updating user.',
      );
    }
  }

  /**
   * @desc Delete a user
   * @param {*} req
   * @param {*} res
   */
  async userDelete(req, res) {
    try {
      let userId = req.params.id;
      let result = await this.service.userDelete(userId);
      if (result) {
        this.ApiRes.successResponseWithData(
          res,
          result,
          'User details deleted successfully!',
        );
      } else {
        this.ApiRes.successResponse(
          res,
          'Some error occurred while deleting user.',
        );
      }
    } catch (err) {
      this.ApiRes.errorResponse(
        res,
        err.message || 'Some error occurred while deleting user.',
      );
    }
  }
}
module.exports = new usersController(userService);
