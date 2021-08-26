module.exports = mongoose => {

  let schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: 'This field is required.'
      },
      email: { 
        type: String, 
        unique: true 
      },
      phone: { 
        type: String, 
        unique: true 
      },
      password: String,
      status: Boolean,
      verified: Boolean,
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role"
        }
      ]
    },
    { timestamps: true }
  );

    schema.path('email').validate((val) => {
      emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRegex.test(val);
    }, 'Invalid e-mail.');

    /*schema.path('email').validate(function(value, done) {
      this.model('User').count({ email: value }, function(err, count) {
          if (err) {
              return done(err);
          } 
          // If `count` is greater than zero, "invalidate"
          done(!count);
      });
    }, 'Email already exists');*/
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const User = mongoose.model("User", schema);
    return User;
  };