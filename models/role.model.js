'use strict';
const mongoose = require('mongoose');
const uuid = require('uuid');
const mongoose_delete = require('mongoose-delete');
const slug = require('mongoose-slug-updater');
const right = require('./rights.schema');
const schema = new mongoose.Schema(
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
      ref: "Role",
      default: null
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
      on:{ save: true, update: true, updateOne: true, updateMany: true, findOneAndUpdate: true },
      uniqueGroupSlug: ['parent'],
    },
    description: {
      type: String,
      trim: true,
      default: null
    },
    rights: [
      {
        resource: {
          type: String,
          ref: 'Resource',
        },
        listView: { type: Boolean },
        singleDetailsView: { type: Boolean },
        fullAccess: { type: Boolean },
        createNew: { type: Boolean },
        updateExisting: { type: Boolean },
        deleteExisting: { type: Boolean },
        downloadList: { type: Boolean },
        downloadSingleDetails: { type: Boolean },
        dropDownList: { type: Boolean },
        manageColumns: { type: Boolean },
        others: { type: Boolean },
        fullDeny: { type: Boolean },
      }
    ],
    status: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true },
);

schema.plugin(mongoose_delete, { deletedAt: true });
schema.plugin(slug);

/*schema.path("_id").validate(function (v) {
      return validator.isUUID(v);
  }, "ID is not a valid GUID: {VALUE}");*/
schema.pre('save', async function (next) {
  let role = this;
  next();
});

schema.pre('updateOne', async function(next) {
  console.log("Pre updateOne", this.getFilter());
  next();
});


schema.pre('update', function(next) {
  console.log("Pre Update");
  next();
});

schema.pre('find', function(next) {
  console.log("Pre Find");
  next();
});

schema.pre('findOne', function(next) {
  console.log("Pre Find One");
  next();
});

schema.post('find', function(doc) {
  console.log("Post Find");
});

schema.post('findOne', function(doc) {
  console.log("Post Find One");
});

schema.pre('deleteOne', function() {
  // Runs when you call `Toy.deleteOne()`
});

schema.pre('deleteOne', { document: true }, function() {
  // Runs when you call `doc.deleteOne()`
});

schema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
});

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  object.v = __v;
  return object;
});
module.exports = mongoose.model('Role', schema);
