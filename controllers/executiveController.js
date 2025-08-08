const Project = require('../models/Project');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

exports.getMyProjects = catchAsync(async (req, res, next) => {
    const executiveId = req.user.id;

    const projects = await Project.find({
        'tasks.assignedTo': executiveId,
        'status': { $ne: 'Completed' }
    }).select('companyName invoiceNumber serviceName tasks status endDate');

    res.status(200).json({
        status: 'success',
        results: projects.length,
        data: {
            projects
        }
    });
});

exports.getCompletedProjects = catchAsync(async (req, res, next) => {
    const executiveId = req.user.id;

    const projects = await Project.find({
        'tasks.assignedTo': executiveId,
        status: 'Completed'
    }).select('companyName invoiceNumber serviceName tasks status completionDate');

    res.status(200).json({
        status: 'success',
        results: projects.length,
        data: {
            projects
        }
    });
});

exports.getMyPayout = catchAsync(async (req, res, next) => {
    const executiveId = req.user.id;

    const user = await User.findById(executiveId).select('baseSalary salaryHistory');

    res.status(200).json({
        status: 'success',
        data: {
            payout: user
        }
    });
});