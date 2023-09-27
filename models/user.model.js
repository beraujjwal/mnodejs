'use strict';
require('dotenv').config();
const moment = require('moment');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const uuid = require('uuid');
const mongoose_delete = require('mongoose-delete');

const { validationError } = require('../system/core/error/validationError');
const right = require('./rights.schema');

const schema = mongoose.Schema(
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
      get: decrypt,
      set: encrypt
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      index: true,
      required: true,
      trim: true,
      get: decrypt,
      set: encrypt
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    password: { type: String, trim: true, select: true },
    verified: {
      type: Boolean,
      index: true,
      default: false
    },
    roles: [
      {
        type: String,
        ref: 'Role',
      },
    ],
    profile: {
      avatar: {
        type: String
      },
      dob: {
        type: Date
      },
      gender: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      country: {
        type: String
      },
      zipCode: {
        type: String
      },
    },
    tokenSalt: {
      type: String
    },
    loginAttempts: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    blockExpires: {
      type: Date,
      default: moment().utc(process.env.APP_TIMEZONE).toDate(),
    },
    rights: [right],
    deviceId: {
      type: String,
      index: true,
      required: false,
      trim: true,
      default: null
    },
    deviceType: {
      type: String,
      index: true,
      required: false,
      trim: true,
      default: null
    },
    fcmToken: {
      type: String,
      index: true,
      required: false,
      trim: true,
      default: null
    },
    deleted: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false, timestamps: true },
);

schema.plugin(mongoose_delete, { deletedAt: true });

schema.path('email').validate((val) => {
  let emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid e-mail.');

schema.pre('save', async function (next) {
  let user = this;
  const saltRounds = 9;
  const currentDateTime = moment().utc(process.env.APP_TIMEZONE).toDate();

  // If user is not new or the password is not modified
  if (!user.isModified('password')) {
    return next();
  }

  if (this.isModified('password') || this.isNew) {
    // Encrypt password before saving to database
    console.log('Password Encrypting');
    let salt = await bcrypt.genSalt(saltRounds);
    user.password = await bcrypt.hash(user.password, salt);
  }

  if (user.loginAttempts >= 5) {
    user.loginAttempts = 0;
    user.blockExpires = new Date(currentDateTime + 60 * 5 * 1000);
  }

  let emailCriteria = {
    email: user.email,
    deleted: false,
    _id: { $ne: user._id },
  };

  const emailResult = await this.constructor.findOne(emailCriteria);

  if (emailResult) {
    //console.warn('results', emailResult);
    user.invalidate('email', 'This email is already associated with an account.');
    const emailError = new validationError({ email: ['This email is already associated with an account.']});
    //console.log(emailError);
    next(emailError);
  } else {
    next();
  }

  let phoneCriteria = {
    phone: user.phone,
    deleted: false,
    _id: { $ne: user._id },
  };

  const phoneResult = await this.constructor.findOne(phoneCriteria);

  if (phoneResult) {
    //console.warn('results', emailResult);
    user.invalidate('phone', 'This phone is already associated with an account.');
    next(new validationError({ phone: ['This phone is already associated with an account.']}));
  } else {
    next();
  }
});

schema.pre('updateOne', async function() {
  let user = this;

  if (user.password) {
    let salt = await bcrypt.genSalt(process.env.SALT_FACTOR);
    user.password = await bcrypt.hash(user.password, salt);
  }
});


schema.pre('update', function(next) {
  //console.log("Pre Update");
  next();
});

schema.pre('find', function(next) {
  //console.log("Pre Find");
  next();
});
schema.pre('findOne', function(next) {
  //console.log("Pre Find One");
  next();
});
schema.post('find', function(doc) {
  //console.log("Post Find");
  //next();
});
schema.post('findOne', function(doc) {
  //console.log("Post Find One");
  //next();
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


schema.set('toObject', { getters: true });
schema.set('toJSON', { getters: true });

function encrypt(text) {
  return text;
}

function decrypt(text) {
  return text;
}

// Virtual for user's full name
/*schema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});*/

schema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model('User', schema);