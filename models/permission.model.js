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
      role_permissions: [
        {
          role_id: { type: String, ref: 'Role' },
          role_name: { type: String },
          create: { type: Boolean },
          delete: { type: Boolean },
          update: { type: Boolean },
          read: { type: Boolean },
        },
      ],
      user_permissions: [
        {
          user_id: { type: String, ref: 'User' },
          user_name: { type: String },
          create: { type: Boolean },
          delete: { type: Boolean },
          update: { type: Boolean },
          read: { type: Boolean },
        },
      ],
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
        console.log("validating: " + JSON.stringify(v));
        return validator.isUUID(v);
    }, "ID is not a valid GUID: {VALUE}");*/
  schema.pre('save', function (next) {
    let permission = this;

    // If user is not new or the password is not modified
    if (!permission.isNew && !permission.isModified('password')) {
      return next();
    }

    if (this.isNew) {
      permission.createAt = permission.updateAt = Date.now();
    } else {
      permission.updateAt = Date.now();
    }

    Permission.findOne({ slug: this.slug }, 'slug', function (err, results) {
      if (err) {
        next(err);
      } else if (results) {
        console.warn('results', results);
        permission.invalidate('slug', 'slug must be unique');
        next(new Error('slug must be unique'));
      } else {
        next();
      }
    });
  });

  const Permission = mongoose.model('Permission', schema);
  return Permission;
};
