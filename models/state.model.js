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
      cities: [
        {
          type: String,
          ref: 'City',
        },
      ],
      country: {
        type: String,
        ref: 'Country',
      },
    },
    { timestamps: true },
  );

  schema.plugin(mongoose_delete, { deletedAt: true });

  const State = mongoose.model('State', schema);
  return State;
};
