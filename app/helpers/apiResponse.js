'use strict';

const autoBind = require('auto-bind');

class ApiResponse {
  /**
   * @desc Response constructor
   *
   * @author Ujjwal Bera
   * @param null
   */
  constructor() {
    autoBind(this);
  }

  successResponse(res, msg) {
    let resData = {
      error: false,
      code: 200,
      message: msg,
    };
    return res.status(200).json(resData);
  }

  successResponseWithData(res, data, msg = null) {
    if (msg == null) msg = 'OK';
    let resData = {
      error: false,
      code: 200,
      message: msg,
      data: data,
    };
    return res.status(200).json(resData);
  }

  errorResponse(res, msg, code) {
    let resData = {
      error: true,
      code: code ? code : 500,
      message: msg,
    };
    return res.status(200).json(resData);
  }

  notFoundResponse(res, msg) {
    let resData = {
      error: true,
      code: 404,
      message: msg,
    };
    return res.status(200).json(resData);
  }

  validationErrorWithData(res, data, msg = null) {
    if (msg == null) msg = 'Validation failed';
    let resData = {
      error: true,
      code: 400,
      message: msg,
      data: data.errors,
    };
    return res.status(200).json(resData);
  }

  unauthorizedResponse(res, msg) {
    let resData = {
      error: true,
      code: 401,
      message: msg,
    };
    return res.status(200).json(resData);
  }
}
module.exports = { ApiResponse };
