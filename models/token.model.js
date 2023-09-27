'use strict';
require('dotenv').config();
const moment = require('moment');
const uuid = require('uuid');
const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

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
    sent_to: {
      type: String,
      index: true,
      required: true,
      trim: true,
    },
    sent_on: {
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
    status: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: moment().utc(process.env.APP_TIMEZONE).toDate(),
      expires: 3600, // this is the expiry time in seconds
    },
  },
  { timestamps: true },
);

schema.plugin(mongoose_delete, { deletedAt: true });

schema.pre('save', async function () {
  let token = this;
  const currentDateTime = moment().utc(process.env.APP_TIMEZONE).toDate();
  token.expiresAt = new Date(currentDateTime + 60 * 60 * 1000);
});

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  object.v = __v;
  return object;
});
module.exports = mongoose.model('Token', schema);