'use strict';
const mongoose_delete = require('mongoose-delete');
module.exports = (mongoose, uuid) => {
  let schema = mongoose.Schema(
    {
      _id: {
        type: Number, //String,
        //auto: true,
        //default: () => uuid.v4(),
        trim: true,
        lowercase: true,
      },
      name: {
        type: String,
        index: true,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        ref: 'State',
      },
    },
    { timestamps: true },
  );

  schema.plugin(mongoose_delete, { deletedAt: true });

  const City = mongoose.model('City', schema);
  return City;
};
