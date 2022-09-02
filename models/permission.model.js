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

  /*schema.path("_id").validate(function (v) {
        return validator.isUUID(v);
    }, "ID is not a valid GUID: {VALUE}");*/
  schema.pre('save', function (next) {
    let permission = this;

    if (this.isNew) {
      permission.createAt = Date.now();
      permission.slug = permission.name.split(' ').join('-').toLowerCase();
      permission.updateAt = Date.now();
    } else {
      permission.updateAt = Date.now();
    }

    Permission.findOne(
      { slug: permission.slug, _id: { $ne: permission._id }, deleted: false },
      'slug',
      function (err, results) {
        if (err) {
          next(err);
        } else if (results) {
          console.warn('results', results);
          permission.invalidate('slug', 'slug must be unique');
          let error = new Error('Name already exists.');
          error.statusCode = 400;
          next(error);
        } else {
          next();
        }
      },
    );
  });

  schema.pre('update', function (next) {
    const modifiedName = this.getUpdate().$set.name;
    if (!modifiedName) {
      return next();
    }
    /*try {
      const newFiedValue = // do whatever...
        (this.getUpdate().$set.field = newFieldValue);
      next();
    } catch (error) {
      return next(error);
    }*/
  });

  const Permission = mongoose.model('Permission', schema);
  return Permission;
};
