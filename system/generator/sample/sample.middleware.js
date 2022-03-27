const autoBind = require('auto-bind');
const { middleware } = require('./middleware');

class MIDDLEWARE_CAMEL_CASE_SINGULAR_FROMMiddleware extends middleware {
  /**
   * Middleware constructor
   * @author MNodejs Cli
   * @param null
   */
  constructor() {
    super();
    autoBind(this);
  }

  /**
   *
   * @param {*} action
   * @param {*} module
   * @returns
   */
  sampleFunction(req, res, next) {
    next();
    return;
  }
}

module.exports = new MIDDLEWARE_CAMEL_CASE_SINGULAR_FROMMiddleware();
