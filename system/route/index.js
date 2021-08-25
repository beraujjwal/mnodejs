'use strict';
const fs = require('fs');
const path = require('path');

const routesPath = __dirname + '/../../routes/';
const basename = path.basename(__filename);

module.exports = function(express) {

    const app = express();
    const router = express.Router();
    fs.readdirSync(routesPath).filter(file => {
        if((file.indexOf('.') !== 0)  && (file.slice(-3) === '.js')) {
            return file;
        }
        var innerDirPath = routesPath + file + '/';
        fs.readdirSync(innerDirPath).filter(innerFile => {
            return (innerFile.indexOf('.') !== 0) && (innerFile.slice(-3) === '.js');
        }).forEach(innerFile => {
            require(path.join(innerDirPath, innerFile))(app, router);
        });
    })
    .forEach(file => {
        require(path.join(routesPath, file))(app, router);
    });


    /*fs.readdirSync( modules ).filter(file => {
        if((file.indexOf('.') === 0)  && (file.slice(-3) !== '.js')) {
            var innerDirPath = modules + file + '/routes/';
            fs.readdirSync(innerDirPath).filter(innerFile => {
                return (innerFile.indexOf('.') !== 0) && (innerFile.slice(-3) === '.js');
            }).forEach(innerFile => {
                require(path.join(innerDirPath, innerFile))(app, router);
            });
        }
        
    });*/


    

}