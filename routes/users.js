const UsersController = require("../app/controllers/users.controller");

const UserValidation = require("../app/validations/user.validation");


module.exports = function(app, router) {
    

    app.use(function(req, res, next) {
        res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
        );    
        next();
    });

    app.all('/', function (req, res, next) {
        console.log('Accessing the secret section ...');
        res.render('index', { title: 'Home Page', msg: 'Welcome to e-Shop Admin' })
    });


    app.post(
        "/auth/signup",    
        [UserValidation.signup],
        UsersController.create
    );


    app.post(
        "/auth/signin",    
        [],
        UsersController.signin
    );


};
