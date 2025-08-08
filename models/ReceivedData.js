const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  service: { type: String, required: true },
  videoUrl: String,
  downloadLink: String,
  uploadedFile: String,
  message: String,
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' }
});

const receivedDataSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
    },
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
    },
    clientName: {
      type: String,
      required: [true, "Client name is required"],
    },
    clientDesignation: String,
    clientContact: String,
    clientEmail: {
        type: String,
        lowercase: true,
    },
    startDate: Date,
    endDate: Date,
    serviceName: String,
    tasks: [taskSchema],
    manager: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Received data must be associated with a manager."],
    }
  },
  {
    timestamps: true,
  }
);

receivedDataSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'manager',
        select: 'name email'
    });
    next();
});

const ReceivedData = mongoose.model("ReceivedData", receivedDataSchema);

module.exports = ReceivedData;