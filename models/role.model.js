module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        name: { 
          type:  mongoose.Schema.Types.String, 
          required: true 
        },
        slug: { 
          type:  mongoose.Schema.Types.String, 
          required: true 
        },
        status: Boolean,
        user_id: [
          {
            type: mongoose.Schema.Types.String, ref: 'User'
          }
        ]
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Role = mongoose.model("Role", schema);
    return Role;
  };
