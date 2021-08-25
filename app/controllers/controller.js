'use strict';
const autoBind = require( 'auto-bind' );
const { BaseController } = require('../../system/core/controller/BaseController');
const { ApiResponse } = require('../helpers/apiResponse');

class Controller extends BaseController {



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

module.exports = { Controller };
