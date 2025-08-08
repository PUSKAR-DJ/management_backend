const Team = require("../models/Team");
const Project = require("../models/Project");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getTeamReport = catchAsync(async (req, res, next) => {
  const managerId = req.user.id;

  const teams = await Team.find({ manager: managerId }).populate({
    path: 'teamLeads executives',
    select: 'name role'
  });

  if (!teams.length) {
    return res.status(200).json({ status: "success", data: { teamReport: [] } });
  }

  const teamMembers = [];
  teams.forEach(team => {
      team.teamLeads.forEach(member => teamMembers.push(member));
      team.executives.forEach(member => teamMembers.push(member));
  });

  const uniqueMemberIds = [...new Set(teamMembers.map(member => member._id.toString()))];

  const reportData = await Promise.all(uniqueMemberIds.map(async (memberId) => {
    const member = teamMembers.find(m => m._id.toString() === memberId);

    const currentProjectsCount = await Project.countDocuments({ assignedTo: memberId, status: 'Current' });
    const completedProjectsCount = await Project.countDocuments({ assignedTo: memberId, status: 'Completed' });
    const delayedProjectsCount = await Project.countDocuments({ assignedTo: memberId, status: 'Delayed' });

    const lastProject = await Project.findOne({ assignedTo: memberId }).sort({ endDate: -1 });

    return {
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

    const projects = await Project.find({ assignedTo: userId }).select('companyName invoiceNumber');

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
