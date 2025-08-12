const Team = require("../models/Team");
const Project = require("../models/Project");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getTeamReport = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;

  let teams;

  // Fetch teams based on the user's role
  if (userRole === 'manager') {
    // A manager sees all teams they manage
    teams = await Team.find({ manager: userId }).populate({
      path: 'teamLeads executives',
      select: 'name role'
    });
  } else if (userRole === 'team_lead') {
    // A team lead only sees the teams they are a part of
    teams = await Team.find({ teamLeads: userId }).populate({
      path: 'executives', // We only need the executives for their report
      select: 'name role'
    });
  }

  if (!teams || teams.length === 0) {
    return res.status(200).json({ status: "success", data: { teamReport: [] } });
  }

  // Collect the relevant team members based on the role
  const teamMembers = [];
  if (userRole === 'manager') {
    teams.forEach(team => {
      team.teamLeads.forEach(member => teamMembers.push(member));
      team.executives.forEach(member => teamMembers.push(member));
    });
  } else { // team_lead
    teams.forEach(team => {
      team.executives.forEach(member => teamMembers.push(member));
    });
  }
  
  // Remove duplicate members if they exist in multiple teams
  const uniqueMemberIds = [...new Set(teamMembers.map(member => member._id.toString()))];

  const reportData = await Promise.all(uniqueMemberIds.map(async (memberId) => {
    const member = teamMembers.find(m => m._id.toString() === memberId);

    const currentProjectsCount = await Project.countDocuments({ 'tasks.assignedTo': memberId, status: 'Current' });
    const completedProjectsCount = await Project.countDocuments({ 'tasks.assignedTo': memberId, status: 'Completed' });
    const delayedProjectsCount = await Project.countDocuments({ 'tasks.assignedTo': memberId, status: 'Delayed' });

    const lastProject = await Project.findOne({ 'tasks.assignedTo': memberId }).sort({ endDate: -1 });

    return {
      userId: member._id,
      name: member.name,
      role: member.role,
      currentProjects: currentProjectsCount,
      completedProjects: completedProjectsCount,
      delayedProjects: delayedProjectsCount,
      deadline: lastProject ? lastProject.endDate : 'N/A'
    };
  }));

  res.status(200).json({
    status: 'success',
    data: {
      teamReport: reportData
    }
  });
});

exports.getMemberProjects = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const projects = await Project.find({ 'tasks.assignedTo': userId }).select('companyName invoiceNumber');

    if (!projects) {
        return next(new AppError('No projects found for this user', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            projects
        }
    });
});
