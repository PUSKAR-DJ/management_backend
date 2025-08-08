const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Team name is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Team description is required"],
    },
    manager: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Team must have a manager"],
    },
    teamLeads: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    executives: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

teamSchema.pre(/^find/, function (next) {
  this.populate({
    path: "manager",
    select: "name email role",
  })
    .populate({
      path: "teamLeads",
      select: "name email role",
    })
    .populate({
      path: "executives",
      select: "name email role",
    })
  next()
})

const Team = mongoose.model("Team", teamSchema)

module.exports = Team
