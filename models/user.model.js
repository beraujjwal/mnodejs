module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        id: String,
        name: String,
        email: String,
        phone: String,
        password: String,
        status: Boolean,
        verified: Boolean,
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const User = mongoose.model("user", schema);
    return User;
  };