'use strict';
const autoBind = require( 'auto-bind' );
const { base } = require('../base');


class baseController extends base {



    /**
     * Base Controller Layer
     * @author Ujjwal Bera
     * @param null
     */
    constructor( ) {
        super( );
        autoBind( this );
    }

}

module.exports = { baseController };
