const bcrypt = require('bcryptjs');
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
      },
      email: {
        type: String,
        index: true,
        unique: true,
      },
      phone: {
        type: String,
        index: true,
        required: true,
        unique: true,
      },
      password: { type: String },
      status: Boolean,
      verified: Boolean,
      roles: [
        {
          type: String,
          ref: 'Role',
        },
      ],
    },
    { timestamps: true },
  );

  schema.path('email').validate((val) => {
    let emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
  }, 'Invalid e-mail.');

  /*schema.path("_id").validate(function (v) {
      console.log("validating: " + JSON.stringify(v));
      return validator.isUUID(v);
  }, "ID is not a valid GUID: {VALUE}");*/

  schema.pre('save', function (next) {
    let user = this;
    //const SALT_FACTOR = 10;

    // If user is not new or the password is not modified
    if (!user.isNew && !user.isModified('password')) {
      return next();
    }

    // Encrypt password before saving to database
    /*bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        console.log(user);
        next();
      });
    });*/

    if (this.isNew) {
      user.createAt = user.updateAt = Date.now();
    } else {
      user.updateAt = Date.now();
    }

    User.findOne({ email: this.email }, 'email', function (err, results) {
      if (err) {
        next(err);
      } else if (results) {
        console.warn('results', results);
        user.invalidate('email', 'email must be unique');
        next(new Error('email must be unique'));
      } else {
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

  const User = mongoose.model('User', schema);
  return User;
};
