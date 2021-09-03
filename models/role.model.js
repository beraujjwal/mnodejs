module.exports = (mongoose, uuid) => {
    var schema = mongoose.Schema(
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
          type:  mongoose.Schema.Types.String, 
          index: true,
          required: true 
        },
        slug: { 
          type:  mongoose.Schema.Types.String,
          index: true,
          required: true 
        },
        status: Boolean/*,
        user_id: [
          {
            type: mongoose.Schema.Types.String, ref: 'User'
          }
        ]*/
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    /*schema.path("_id").validate(function (v) {
        console.log("validating: " + JSON.stringify(v));
        return validator.isUUID(v);
    }, "ID is not a valid GUID: {VALUE}");*/
    
  
    const Role = mongoose.model("Role", schema);
    return Role;
  };
