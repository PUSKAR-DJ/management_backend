const mongoose = require('mongoose');
const { type } = require('os');

const reviewSchema = new mongoose.Schema({
    clientName:{
        type: String,
        required: [true, "Client name is required"]
    },
    contactNo:{
        type: String,
        required: true
    },
    startDate:{
        type: Date,
        required: true
    },
    serviceName:{
        type: String,
        required: true
    },
    designation: {
        type: String, required: true
    },
    emailId: {
        type: String, required: true
    },
    endDate: {
        type: Date, required: true
    }
});

module.exports = mongoose.model('Review', reviewSchema);