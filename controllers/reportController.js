const Team = require("../models/Team");
const Project = require("../models/Project");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getTeamReport = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  let reportData = [];

  if (userRole === 'manager') {
    const projects = await Project.find({ manager: userId }).populate('tasks.assignedTo', 'name role');
    
    const memberStats = new Map();

    projects.forEach(project => {
      project.tasks.forEach(task => {
        if (task.assignedTo) {
          const memberId = task.assignedTo._id.toString();
          
          if (!memberStats.has(memberId)) {
            memberStats.set(memberId, {
              userId: task.assignedTo._id,
              name: task.assignedTo.name,
              role: task.assignedTo.role,
              currentProjects: 0,
              completedProjects: 0,
              delayedProjects: 0,
              deadlines: []
            });
          }

          const stats = memberStats.get(memberId);
          if (project.status === 'Current') {
            stats.currentProjects++;
          } else if (project.status === 'Completed') {
            stats.completedProjects++;
          } else if (project.status === 'Delayed') {
            stats.delayedProjects++;
          }
          if(project.endDate) {
            stats.deadlines.push(project.endDate);
          }
        }
      });
    });
    
    reportData = Array.from(memberStats.values()).map(stats => {
        const latestDeadline = stats.deadlines.length > 0 ? new Date(Math.max.apply(null, stats.deadlines)) : 'N/A';
        delete stats.deadlines;
        return { ...stats, deadline: latestDeadline };
    });

  } else if (userRole === 'team_lead') {
    const teams = await Team.find({ teamLeads: userId }).populate('executives', 'name role');
    if (teams && teams.length > 0) {
        const executives = teams.flatMap(team => team.executives);
        const uniqueMemberIds = [...new Set(executives.map(member => member._id.toString()))];

        reportData = await Promise.all(uniqueMemberIds.map(async (memberId) => {
            const member = executives.find(m => m._id.toString() === memberId);
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
    }
  }

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