const autoBind = require('auto-bind');
const { middleware } = require('./middleware');

class blogMiddleware extends middleware {
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

module.exports = new blogMiddleware();
