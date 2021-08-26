'use strict';
const autoBind = require( 'auto-bind' );
const db = require("../model");
require( 'dotenv' ).config();


class BaseMiddleware {



    /**
     * Base Controller Layer
     * @author Ujjwal Bera
     * @param null
     */
    constructor( ) {
        this.db = db;
        this.env = process.env;
        autoBind( this );
    }

}

module.exports = { BaseMiddleware };

