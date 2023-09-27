const httpStatusCode = require('./httpStatusCode');
class baseError extends Error {

  /**
   * HTTP Error Class
   * @param error
   */
  constructor(error, code = 500) {

    super(error);

    Error.captureStackTrace(this, this.constructor);

    let statusCode = code;
    let message = error || 'Something wrong!';
    let statusName = 'INTERNAL_SERVER_ERROR';

    switch (statusCode) {
      case 100:
        statusName = 'CONTINUE';
        break;
      case 101:
        statusName = 'SWITCHING_PROTOCOLS';
        break;
      case 102:
        statusName = 'PROCESSING';
        break;
      case 103:
        statusName = 'EARLY_HINTS';
        break;
      case 200:
        statusName = 'OK';
        break;
      case 201:
        statusName = 'CREATED';
        break;
      case 202:
        statusName = 'ACCEPTED';
        break;
      case 203:
        statusName = 'NON_AUTHORITATIVE_INFORMATION';
        break;
      case 204:
        statusName = 'NO_CONTENT';
        break;
      case 205:
        statusName = 'RESET_CONTENT';
        break;
      case 206:
        statusName = 'PARTIAL_CONTENT';
        break;
      case 207:
        statusName = 'MULTI_STATUS';
        break;
      case 208:
        statusName = 'ALREADY_REPORTED';
        break;
      case 226:
        statusName = 'IM_USED';
        break;
      case 300:
        statusName = 'MULTIPLE_CHOICES';
        break;
      case 301:
        statusName = 'MOVED_PERMANENTLY';
        break;
      case 302:
        statusName = 'FOUND';
        break;
      case 303:
        statusName = 'SEE_OTHER';
        break;
      case 304:
        statusName = 'NOT_MODIFIED';
        break;
      case 305:
        statusName = 'USE_PROXY';
        break;
      case 307:
        statusName = 'TEMPORARY_REDIRECT';
        break;
      case 400:
        statusName = 'BAD_REQUEST';
        break;
      case 401:
        statusName = 'UNAUTHORIZED';
        break;
      case 403:
        statusName = 'FORBIDDEN';
        break;
      case 404:
        statusName = 'NOT_FOUND';
        break;
      case 405:
        statusName = 'METHOD_NOT_ALLOWED';
        break;
      case 406:
        statusName = 'NOT_ACCEPTABLE';
        break;
      case 407:
        statusName = 'PROXY_AUTHENTICATION_REQUIRED';
        break;
      case 408:
        statusName = 'REQUEST_TIMEOUT';
        break;
      case 409:
        statusName = 'CONFLICT';
        break;
      case 410:
        statusName = 'GONE';
        break;
      case 411:
        statusName = 'LENGTH_REQUIRED';
        break;
      case 412:
        statusName = 'PRECONDITION_FAILED';
        break;
      case 413:
        statusName = 'REQUEST_ENTITY_TOO_LARGE';
        break;
      case 414:
        statusName = 'REQUEST_URI_TOO_LONG';
        break;
      case 415:
        statusName = 'UNSUPPORTED_MEDIA_TYPE';
        break;
      case 416:
        statusName = 'REQUESTED_RANGE_NOT_SATISFIABLE';
        break;
      case 417:
        statusName = 'EXPECTATION_FAILED';
        break;
      case 419:
        statusName = 'MISSING_ARGUMENTS';
        break;
      case 420:
        statusName = 'INVALID_ARGUMENTS';
        break;
      case 422:
        statusName = 'MISSING_REQUIRED_FIELDS';
        break;
      case 500:
        statusName = 'INTERNAL_SERVER_ERROR';
        break;
      case 501:
        statusName = 'NOT_IMPLEMENTED';
        break;
      case 502:
        statusName = 'BAD_GATEWAY';
        break;
      case 503:
        statusName = 'SERVICE_UNAVAILABLE';
        break;
      case 504:
        statusName = 'GATEWAY_TIMEOUT';
        break;
      case 505:
        statusName = 'HTTP_VERSION_NOT_SUPPORTED';
        break;
      case 550:
        statusName = 'INITIALIZATION_FAILURE';
        break;
      default:
        statusName = 'INTERNAL_SERVER_ERROR';
    }

    if(typeof error == 'object') {
      statusCode = error.code;
      message = error.message;
    }

    //this.statusCode = statusCode;
    this.code = statusCode
    this.status = false
    this.message = message;
    this.errors = error?.errors;
    this.name = statusName;
  }
}


module.exports = { baseError }
