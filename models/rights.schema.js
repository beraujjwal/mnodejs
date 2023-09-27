'use strict';
const mongoose = require('mongoose');
const right = new mongoose.Schema(
    {
      resource: {
        type: String,
        ref: 'Resource',
      },
      listView: { type: Boolean, default: false },
      singleDetailsView: { type: Boolean, default: false },
      fullAccess: { type: Boolean, default: false },
      createNew: { type: Boolean, default: false },
      updateExisting: { type: Boolean, default: false },
      deleteExisting: { type: Boolean, default: false },
      downloadList: { type: Boolean, default: false },
      downloadSingleDetails: { type: Boolean, default: false },
      dropDownList: { type: Boolean, default: false },
      manageColumns: { type: Boolean, default: false },
      others: { type: Boolean, default: false },
      fullDeny: { type: Boolean, default: false },
    }
);

module.exports =  right