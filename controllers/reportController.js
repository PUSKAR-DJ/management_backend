const Project = require("../models/Project");
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

exports.getTeamReport = catchAsync(async (req, res, next) => {
    const managerId = req.user.id;

    // 1. Fetch all projects managed by the current user
    const projects = await Project.find({ manager: managerId })
        .populate('tasks.assignedTo', 'name'); // Populate assigned user's name

    // 2. Calculate overall statistics from the projects
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const pendingProjects = projects.filter(p => p.status === 'Pending').length;

    // Calculate last month's payout from completed projects
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthPayout = projects
        .filter(p => p.status === 'Completed' && p.completionDate && new Date(p.completionDate) >= lastMonth)
        .reduce((sum, p) => sum + p.projectValue, 0);

    // 3. Prepare the list of projects for the table, ensuring assignedTo is handled
    const teamMemberProjects = projects.map(project => ({
        _id: project._id,
        companyName: project.companyName,
        // Find the first assigned user in tasks to display, or 'N/A'
        assignedTo: project.tasks.find(t => t.assignedTo)?.assignedTo || { name: 'N/A' },
        serviceName: project.serviceName,
        startDate: project.startDate,
        endDate: project.endDate,
    }));

    // 4. Consolidate all data into a single response object
    const reportData = {
        stats: {
            totalProjects,
            completedProjects,
            pendingProjects,
            lastMonthPayout
        },
        teamMemberProjects
    };

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
