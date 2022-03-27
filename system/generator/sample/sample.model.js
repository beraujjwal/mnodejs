'use strict';
const mongoose_delete = require('mongoose-delete');
module.exports = (mongoose, uuid) => {
  var schema = mongoose.Schema(
    {
      _id: {
        type: String,
        auto: true,
        default: () => uuid.v4(),
        trim: true,
        lowercase: true,
      },
      name: {
        type: String,
        index: true,
        required: true,
        trim: true,
      },
      slug: {
        type: String,
        index: true,
        required: true,
        trim: true,
        lowercase: true,
      },
      status: Boolean,
    },
    { timestamps: true },
  );

  schema.plugin(mongoose_delete, { deletedAt: true });

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.v = __v;
    return object;
  });

  const MODEL_SINGULAR_FORM = mongoose.model('MODEL_SINGULAR_FORM', schema);
  return MODEL_SINGULAR_FORM;
};
