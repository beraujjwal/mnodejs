'use strict';
const autoBind = require( 'auto-bind' );
const db = require("../model");
require( 'dotenv' ).config();


class index {



    /**
     * Base Controller Layer
     * @author Ujjwal Bera
     * @param null
     */
    constructor( ) {
        this.db = db;
        this.transaction = db.trans;
        this.env = process.env;
        autoBind( this );
    }

}

module.exports = { base: index };
