'use strict';
const autoBind = require( 'auto-bind' );
const db = require("../model");
require( 'dotenv' ).config();

class BaseService {



    /**
     * Base Controller Layer
     * @author Ujjwal Bera
     * @param null
     */
    constructor( ) {
        this.db = db;
        this.env = process.env;
        this.transaction = db.trans;
        autoBind( this );
    }

}

module.exports = { BaseService };
