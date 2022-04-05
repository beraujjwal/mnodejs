'use strict';
const bcrypt = require('bcryptjs');
const mongoose_delete = require('mongoose-delete');
module.exports = (mongoose, uuid) => {
  let schema = mongoose.Schema(
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
      email: {
        type: String,
        lowercase: true,
        index: true,
        trim: true,
      },
      phone: {
        type: String,
        index: true,
        required: true,
        trim: true,
      },
      password: { type: String, trim: true, select: true },
      status: Boolean,
      verified: {
        type: Boolean,
        index: true,
        trim: true,
      },
      roles: [
        {
          type: String,
          ref: 'Role',
        },
      ],
      loginAttempts: {
        type: Number,
        default: 0,
      },
      blockExpires: {
        type: Date,
        default: Date.now,
      },
      rights: [
        {
          resource: {
            type: String,
            ref: 'Resource',
          },
          create: { type: Boolean },
          delete: { type: Boolean },
          update: { type: Boolean },
          read: { type: Boolean },
          deny: { type: Boolean },
        },
      ],
    },
    { timestamps: true },
  );

  schema.plugin(mongoose_delete, { deletedAt: true });

  schema.path('email').validate((val) => {
    let emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
  }, 'Invalid e-mail.');

  /*schema.path("_id").validate(function (v) {
      console.log("validating: " + JSON.stringify(v));
      return validator.isUUID(v);
  }, "ID is not a valid GUID: {VALUE}");*/

  schema.pre('save', async function (next) {
    let user = this;
    const SALT_FACTOR = 10;

    // If user is not new or the password is not modified
    if (!user.isModified('password')) {
      return next();
    }

    if (this.isModified('password') || this.isNew) {
      // Encrypt password before saving to database
      let salt = await bcrypt.genSalt(SALT_FACTOR);
      user.password = await bcrypt.hash(user.password, salt);
    }
    if (user.isNew) {
      user.createAt = user.updateAt = Date.now();
    } else {
      user.updateAt = Date.now();
    }

    if (user.loginAttempts >= 5) {
      user.loginAttempts = 0;
      user.blockExpires = new Date(Date.now() + 60 * 5 * 1000);
    }

    let emailCriteria = {
      email: user.email,
      verified: true,
      deleted: false,
      status: false,
      _id: { $ne: user._id },
    };
    await User.findOne(emailCriteria, 'email', async function (err, results) {
      if (err) {
        next(err);
      } else if (results) {
        //console.warn('results', results);
        user.invalidate('email', 'Email must be unique');
        next(new Error('Email must be unique'));
      } else {
        //console.log('Email unique check pass');
        next();
      }
    });

    let phoneCriteria = {
      phone: user.phone,
      verified: true,
      deleted: false,
      status: false,
      _id: { $ne: user._id },
    };
    await User.findOne(phoneCriteria, 'phone', async function (err, results) {
      if (err) {
        next(err);
      } else if (results) {
        //console.warn('results', results);
        user.invalidate('phone', 'Phone number must be unique');
        next(new Error('Phone number must be unique'));
      } else {
        //console.log('Phone unique check pass');
        next();
      }
    });
  });

  schema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.v = __v;
    return object;
  });

  // Virtual for user's full name
  /*schema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
  });*/

  schema.methods.comparePassword = async function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return cb(err);
      cb(null, isMatch);
    });
  };

  const User = mongoose.model('User', schema);
  return User;
};
