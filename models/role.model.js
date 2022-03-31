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
      rights: [
        {
          resource: {
            type: String,
            ref: 'Resource',
          },
          full: { type: Boolean },
          create: { type: Boolean },
          read: { type: Boolean },
          update: { type: Boolean },
          delete: { type: Boolean },
          deny: { type: Boolean },
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
    let role = this;

    if (this.isNew) {
      role.createAt = role.updateAt = Date.now();
    } else {
      role.updateAt = Date.now();
    }

    Role.findOne(
      { slug: this.slug, _id: { $ne: role._id }, deleted: false },
      'slug',
      function (err, results) {
        if (err) {
          next(err);
        } else if (results) {
          console.warn('results', results);
          role.invalidate('slug', 'slug must be unique');
          next(new Error('slug must be unique'));
        } else {
          next();
        }
      },
    );
  });

  const Role = mongoose.model('Role', schema);
  return Role;
};
