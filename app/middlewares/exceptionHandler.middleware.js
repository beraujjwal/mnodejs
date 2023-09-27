const { response } = require('../../system/core/helpers/apiResponse');
const mongoose = require('mongoose');

exports.exceptionHandler = (controllerFunction) => {
  return async (req, res, next) => {
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      const result = await controllerFunction(req, session);
      const resultStructure = {
        code: result.code,
        error: false,
        message: result.message,
        data: result.result
      }
      await session.commitTransaction();
      return res.status(result.code).json(response(resultStructure));
    } catch (error) {
      console.log('exceptionHandler', error);
      await session.abortTransaction();
      next(error);
    } finally {
      await session.endSession();
    }
  };
};