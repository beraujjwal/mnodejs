module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        name: String,
        slug: String,
        status: Boolean
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Role = mongoose.model("role", schema);
    return Role;
  };