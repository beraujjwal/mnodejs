'use strict';
const { baseError } = require('@error/baseError');
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

  schema.pre('save', function (next) {
    let data = this;

    if (this.isNew) {
      data.createAt = Date.now();
      data.slug = data.name.split(' ').join('-').toLowerCase();
      data.updateAt = Date.now();
    } else {
      data.updateAt = Date.now();
    }

    MODEL_SINGULAR_FORM.findOne(
      { slug: data.slug, _id: { $ne: data._id }, deleted: false },
      'slug',
      function (err, results) {
        if (err) {
          next(err);
        } else if (results) {
          console.warn('results', results);
          data.invalidate('slug', 'slug must be unique');
          let error = new Error('Name already exists.');
          error.statusCode = 400;
          next(error);
        } else {
          next();
        }
      },
    );
  });

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.v = __v;
    return object;
  });

  const MODEL_SINGULAR_FORM = mongoose.model('MODEL_SINGULAR_FORM', schema);
  return MODEL_SINGULAR_FORM;
};
