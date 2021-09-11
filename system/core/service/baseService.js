'use strict';
const autoBind = require( 'auto-bind' );
const {base} = require("../base");

class baseService extends base {



    /**
     * Base Service Layer
     * @author Ujjwal Bera
     * @param null
     */
    constructor( ) {
        super( );
        autoBind( this );
    }

}

module.exports = { baseService };
