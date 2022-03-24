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
      user: {
        type: String,
        ref: 'User',
      },
      token: {
        type: String,
        index: true,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        index: true,
        required: true,
        trim: true,
      },
      status: Boolean,
      expiresAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // this is the expiry time in seconds
      },
    },
    { timestamps: true },
  );

  schema.plugin(mongoose_delete, { deletedAt: true });

  schema.pre('save', async function () {
    let token = this;
    token.expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  });

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

  const Token = mongoose.model('Token', schema);
  return Token;
};
