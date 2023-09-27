'use strict';
const uuid = require('uuid');
const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');
const schema = mongoose.Schema(
  {
    _id: {
      type: String,
      auto: true,
      default: () => uuid.v4(),
      trim: true,
      lowercase: true,
    },
    parent: {
      type: String,
      index: true,
      default: null,
      ref: 'Resource'
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
      slug: "name",
      unique: true,
      slugPaddingSize: 4,
      on:{ save: true, update: true, updateOne: true, updateMany: true, findOneAndUpdate: true }
    },
    description: {
      type: String,
      trim: true,
      default: null
    },
    rightsAvailable: [
      {
        type: String
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

schema.plugin(mongoose_delete, { deletedAt: true });
schema.plugin(slug);

// schema.method('toJSON', function () {
//   const { __v, _id, ...object } = this.toObject();
//   object.id = _id;
//   object.v = __v;
//   return object;
// });

schema.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  }
});

// schema.set('toObject', {
//   transform: function (doc, ret) {
//     ret.id = ret._id
//     delete ret._id
//     delete ret.__v
//   }
// });

// schema.set('debug', (collection, method, query) => {
//   logger.info({
//     type: 'query',
//     collection,
//     method,
//     query
//   });
// });

/*schema.path("_id").validate(function (v) {
      return validator.isUUID(v);
  }, "ID is not a valid GUID: {VALUE}");*/
schema.pre('save', function (next) {
  let resource = this;

  if (resource.isNew) {
    resource.createAt = resource.updateAt = Date.now();
  } else {
    resource.updateAt = Date.now();
  }

  this.constructor.findOne({ name: resource.name, _id: { $ne: resource._id }, deleted: false },function(err, results) {
    if(err) {
      next(err);
    } else if(results) {
      let error = new Error('Resource name already exists.');
      error.statusCode = 400;
      next(error);
    } else {
      next();
    }
  });

});

module.exports = mongoose.model('Resource', schema);