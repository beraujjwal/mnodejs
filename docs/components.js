module.exports = {
    components: {
      schemas: {
        // id model
        id: {
          type: "string", // data type
          description: "An id of a item", // desc
          example: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", // example of an id
        },
        // user model
        User: {
          type: "object", // data type
          properties: {
            _id: {
              type: "string", // data-type
              description: "User unique identifier representing a specific", // desc
              example: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX", // example of an id
              uniqueItems: true,
            },
            name: {
              type: "string", // data-type
              description: "User name", // desc
              example: "John Doe", // example of a title
            },
            email: {
              type: "string", // data-type
              description: "User email", // desc
              example: "johndoe@example.com", // example of a title
            },
            phone: {
              type: "string", // data-type
              description: "User phone number", // desc
              example: "9876543210", // example of a title
            },
            password: {
              type: "string", // data-type
              description: "User password", // desc
              example: "XXXXXXXXXX", // example of a title
            },
            status: {
              type: "boolean", // data type
              description: "User status", // desc
              example: false, // example of a completed value
            },
            verified: {
              type: "boolean", // data type
              description: "verified status", // desc
              example: false, // example of a completed value
            },
            roles: {
              type: "array", // data-type
              description: "Roles UUID array", // desc
              item: {
                type: "string",
                description: "verified status", // desc
                example: false,
              },
            },
            loginAttempts: {
              type: "number",
              description: "login attempts", // desc
              example: 1,
            },
            blockExpires: {
              type: "string",
              description: "Block expires status", // desc
              example: false,
            },
            rights: {
              type: "array", // data-type
              description: "Roles UUID array", // desc
              items: {
                type: "array",
                properties: {
                  resource: {
                    type: "string"
                  },
                  create: {
                    type: "boolean"
                  },
                  delete: {
                    type: "boolean"
                  },
                  update: {
                    type: "boolean"
                  },
                  read: {
                    type: "boolean"
                  },
                  deny: {
                    type: "boolean"
                  }
                }
              }
            },
          },
        },
        // Todo input model
        TodoInput: {
          type: "object", // data type
          properties: {
            title: {
              type: "string", // data type
              description: "Todo's title", // desc
              example: "Coding in JavaScript", // example of a title
            },
            completed: {
              type: "boolean", // data type
              description: "The status of the todo", // desc
              example: false, // example of a completed value
            },
          },
        },
        // error model
        Error: {
          type: "object", //data type
          properties: {
            message: {
              type: "string", // data type
              description: "Error message", // desc
              example: "Not found", // example of an error message
            },
            internal_code: {
              type: "string", // data type
              description: "Error internal code", // desc
              example: "Invalid parameters", // example of an error internal code
            },
          },
        },
      },
    },
  };