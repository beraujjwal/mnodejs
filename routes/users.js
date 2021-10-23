const usersController = require("../app/controllers/users.controller");

const userValidation = require("../app/validations/user.validation");


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

    app.use('/api/v1.0', router);

    router.post(
        "/auth/signup",    
        [userValidation.signup],
        usersController.create
    );

    app.use('/api/v2.0', router);

    router.post(
        "/auth/signin",    
        [],
        usersController.signin
    );


};
