'use strict';
const uuid = require('uuid');
const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
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
    stateCode: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: Number,
      ref: 'Country',
    },
    latitude: {
      type: String,
      required: true,
      trim: true,
    },
    longitude: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true },
);

schema.plugin(mongoose_delete, { deletedAt: true });

module.exports = mongoose.model('State', schema);