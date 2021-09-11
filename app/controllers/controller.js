'use strict';
const autoBind = require( 'auto-bind' );
const { baseController } = require('../../system/core/controller/baseController');
const { ApiResponse } = require('../helpers/apiResponse');

class controller extends baseController {



    /**
     * @desc Controller constructor
     * 
     * @author Ujjwal Bera
     * @param null
     */
    constructor( ) {
        super( );
        this.ApiRes = new ApiResponse( );
        autoBind( this );
    }

}

module.exports = { controller };
