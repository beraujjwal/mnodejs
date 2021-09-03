'use strict';
require( 'dotenv' ).config();
const autoBind = require( 'auto-bind' );

class ApiResponse {
 


    /**
     * @desc Controller constructor
     * 
     * @author Ujjwal Bera
     * @param null
     */
	 constructor( ) {
        autoBind( this );
    }

	successResponse(res, msg) {
		let resData = {
			error: false,
			message: msg
		};
		return res.status(200).json(resData);
	}

	successResponseWithData(res, msg, data) {
		let resData = {
			error: false,
			message: msg,
			data: data
		};
		return res.status(200).json(resData);
	}

	errorResponse(res, msg) {
		let resData = {
			error: true,
			message: msg,
		};
		return res.status(500).json(resData);
	}

	notFoundResponse(res, msg) {
		let resData = {
			error: true,
			message: msg,
		};
		return res.status(404).json(resData);
	}

	validationErrorWithData(res, msg, data) {
		let resData = {
			error: true,
			message: msg,
			data: data
		};
		return res.status(400).json(resData);
	}

	unauthorizedResponse(res, msg) {
		let resData = {
			error: true,
			message: msg,
		};
		return res.status(401).json(resData);
	}

}
module.exports = { ApiResponse };