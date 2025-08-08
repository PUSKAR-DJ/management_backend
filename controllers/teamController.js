const Team = require("../models/Team")
const User = require("../models/User")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")

exports.getAllTeams = catchAsync(async (req, res, next) => {
  let teams

  if (req.user.role === "manager") {
    teams = await Team.find()
  } else {
    teams = await Team.find({
      $or: [{ teamLeads: req.user.id }, { executives: req.user.id }],
    })
  }

  res.status(200).json({
    status: "success",
    results: teams.length,
    data: {
      teams,
    },
  })
})

exports.createTeam = catchAsync(async (req, res, next) => {
  // Only managers can create teams
  if (req.user.role !== "manager") {
    return next(new AppError("Only managers can create teams", 403))
  }

  const { name, description, teamLeads, executives } = req.body

  const newTeam = await Team.create({
    name,
    description,
    manager: req.user._id,
    teamLeads: teamLeads || [],
    executives: executives || [],
  })

  res.status(201).json({
    status: "success",
    data: {
      team: newTeam,
    },
  })
})

exports.getTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id)

  if (!team) {
    return next(new AppError("No team found with that ID", 404))
  }

  const isManager = team.manager._id.toString() === req.user._id.toString()
  const isTeamLead = team.teamLeads.some(lead => lead._id.toString() === req.user._id.toString())

  if (!isManager && !isTeamLead) {
    return next(new AppError("You do not have permission to view this team's details", 403))
  }

  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  })
})

exports.updateTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id)

  if (!team) {
    return next(new AppError("No team found with that ID", 404))
  }

  // Only the team manager can update the team
  if (team.manager._id.toString() !== req.user._id.toString() && req.user.role !== "manager") {
    return next(new AppError("You can only update teams you manage", 403))
  }

  const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    status: "success",
    data: {
      team: updatedTeam,
    },
  })
})

exports.deleteTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id)

  if (!team) {
    return next(new AppError("No team found with that ID", 404))
  }

  // Only the team manager can delete the team
  if (team.manager._id.toString() !== req.user._id.toString() && req.user.role !== "manager") {
    return next(new AppError("You can only delete teams you manage", 403))
  }

  await Team.findByIdAndDelete(req.params.id)

  res.status(204).json({
    status: "success",
    data: null,
  })
})

exports.addTeamMember = catchAsync(async (req, res, next) => {
  const { userId, role } = req.body;
  const team = await Team.findById(req.params.id);

  if (!team) {
    return next(new AppError("No team found with that ID", 404));
  }

  const isManager = team.manager.toString() === req.user._id.toString();
  const isTeamLead = team.teamLeads.some(
    (leadId) => leadId.toString() === req.user._id.toString()
  );

  // Only the team manager or team leads can add members
  if (!isManager && !isTeamLead) {
    return next(new AppError("Only team managers or team leads can add members", 403));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (role === "team_lead") {
    if (!team.teamLeads.includes(userId)) {
      team.teamLeads.push(userId);
    }
  } else if (role === "executive") {
    if (!team.executives.includes(userId)) {
      team.executives.push(userId);
    }
  } else {
    return next(new AppError("Invalid role specified", 400));
  }

  await team.save();

  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  });
});
