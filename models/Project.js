const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  service: {
    type: String,
    required: [true, "Task service name is required"],
  },
  videoUrl: String,
  downloadLink: String,
  uploadedFile: String,
  message: String,
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  }
});

const projectSchema = new mongoose.Schema(
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
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: Date,
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
    },
    projectValue: {
        type: Number,
        required: [true, "Project value or income is required for dashboard calculations."]
    },
    status: {
      type: String,
      enum: ["Pending", "Current", "Completed", "Delayed", "Cancelled"],
      default: "Pending",
    },
    tasks: [taskSchema],
    team: {
      type: mongoose.Schema.ObjectId,
      ref: "Team",
    },
    manager: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A project must have a manager."],
    },
    completionDate: Date,
  },
  {
    timestamps: true,
  }
);

projectSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'manager',
        select: 'name email'
    })
    .populate({
        path: 'tasks.assignedTo',
        select: 'name email role'
    });
    next();
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;