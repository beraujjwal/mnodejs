'use strict';
const autoBind = require( 'auto-bind' );
const { BaseController } = require('../../system/core/controller/BaseController');

class Controller extends BaseController {



    /**
     * @desc Controller constructor
     * 
     * @author Ujjwal Bera
     * @param null
     */
    constructor( ) {
        super( );
        autoBind( this );
    }

}

module.exports = { Controller };
