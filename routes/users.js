const UsersController = require("../app/controllers/users.controller");


module.exports = function(app, router) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );    
    next();
  });

 console.log('HERE');

  app.get('/', function (req, res, next) {
    console.log('Accessing the secret section ...');
    res.render('index', { title: 'Home Page', msg: 'Welcome to e-Shop Admin' })
  });


  app.post(
    "/auth/signup",    
    [],
    UsersController.create
  );


};
