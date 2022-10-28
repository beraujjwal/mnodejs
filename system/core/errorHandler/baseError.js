class BadRequestError extends Error {  
    constructor (message) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 400
    }
  
    statusCode() {
      return this.status
    }
}


class UnauthorizedError extends Error {  
    constructor (message) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 401
    }
  
    statusCode() {
      return this.status
    }
}


class PaymentRequiredError extends Error {  
    constructor (message) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 402
    }
  
    statusCode() {
      return this.status
    }
}


class ForbiddenError extends Error {  
    constructor (message) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 404
    }
  
    statusCode() {
      return this.status
    }
}


class NotFoundError extends Error {  
    constructor (message) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 404
    }
  
    statusCode() {
      return this.status
    }
}


class MethodNotAllowedError extends Error {  
    constructor (message) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 405
    }
  
    statusCode() {
      return this.status
    }
}


class InternalServerError extends Error {  
    constructor (message) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 500
    }
  
    statusCode() {
      return this.status
    }
}


class BadGatewayError extends Error {  
    constructor (message) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 502
    }
  
    statusCode() {
      return this.status
    }
}


class ServiceUnavailableError extends Error {  
    constructor (message) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 503
    }
  
    statusCode() {
      return this.status
    }
}


class CommonErrorError extends Error {  
    constructor (message, code) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.message = message;
      this.status = code
    }
  
    statusCode() {
      return this.status
    }
}

module.exports = { BadRequestError, UnauthorizedError, PaymentRequiredError, ForbiddenError, NotFoundError, MethodNotAllowedError, InternalServerError, BadGatewayError,  ServiceUnavailableError, CommonErrorError };
