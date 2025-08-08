const mongoose = require('mongoose');

const tlReviewSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  invoiceNo: {
    type: String,
    required: true
  },
  serviceName: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  projectFile: {
    type: String
  }
});

module.exports = mongoose.model('TLReview', tlReviewSchema);