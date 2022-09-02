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
      sortname: {
        type: String,
        lowercase: true,
        index: true,
        trim: true,
      },
      states: [
        {
          type: String,
          ref: 'State',
        },
      ],
    },
    { timestamps: true },
  );

  schema.plugin(mongoose_delete, { deletedAt: true });

  const Country = mongoose.model('Country', schema);
  return Country;
};
