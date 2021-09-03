'use strict';
const autoBind = require( 'auto-bind' );
const crypto = require('crypto');
const { BaseService } = require('../../system/core/service/BaseService');
const { ApiResponse } = require('../helpers/apiResponse');

const mailer =  require('../helpers/mailer');
const crypto = require('crypto');

class Service extends BaseService {



    /**
     * Service constructor
     * @author Ujjwal Bera
     * @param null
     */
    constructor( ) {
        super( );
        this.mailer = mailer;
        this.crypto = crypto;
        this.ApiRes = new ApiResponse( );
        autoBind( this );
    }


    async isUnique(model, key, value, id=null) {
      const query = [];

      value = value.toLowerCase();
      value = value.replace(/[^a-zA-Z ]/g, "");
      value = value.replace(/[^a-zA-Z]/g, "-");

      if(value) {
        query.push({
          [key]: {
            [this.Op.eq]: value
          }
        })
      }

      if(id != null) {
        query.push({
          id: {
            [this.Op.ne]: id
          }
        })
      }

      return model.findOne({
        where: {          
          [this.Op.and]: query
        }
      });
    }

}

module.exports = { Service };