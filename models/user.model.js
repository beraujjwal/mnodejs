module.exports = (mongoose, uuid) => {

  let schema = mongoose.Schema(
    {
      _id: { 
        type: String,
        auto: true,
        default: () =>
          uuid.v4(),
          trim: true,
          lowercase: true
        
      },
      name: {
        type: String,
        index: true,
        required: true
      },
      email: { 
        type: String,
        index: true,
        unique: true
      },
      phone: { 
        type: String,
        index: true,
        required: true,
        unique: true 
      },
      password: String,
      status: Boolean,
      verified: Boolean,
      roles: [
        {
          type: String,
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

  /*schema.path("_id").validate(function (v) {
      console.log("validating: " + JSON.stringify(v));
      return validator.isUUID(v);
  }, "ID is not a valid GUID: {VALUE}");*/
  
  schema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  
  const User = mongoose.model("User", schema);
  return User;
};