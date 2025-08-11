const Project = require('../models/Project');
const User = require('../models/User');
const Team = require('../models/Team');
const catchAsync = require('../utils/catchAsync');

exports.getDashboardStats = catchAsync(async (req, res, next) => {
    
    const userId = req.user.id;
    const userRole = req.user.role;

    let stats = {};
    let upcomingProjects = [];

    if(userRole == "manager"){
        const totalProjects = await Project.countDocuments({ manager: userId });
        const currentProjects = await Project.countDocuments({ manager: userId, status: 'Current' });
        const completedProjects = await Project.countDocuments({ manager: userId, status: 'Completed' });
        const remainingProjects = await Project.countDocuments({ manager: userId, status: { $in: ['Pending', 'Delayed'] } });
        const delayedProjects = await Project.countDocuments({ manager: userId, status: 'Delayed' });

        const totalEmployees = await User.countDocuments({ active: true, role: { $ne: 'manager' } });
        const totalTls = await User.countDocuments({ active: true, role: 'team_lead' });

        upcomingProjects = await Project.find({ manager: userId, status: { $in: ['Pending', 'Current', 'Delayed'] } })
            .select('companyName invoiceNumber serviceName startDate endDate')
            .sort({ startDate: 1 });

        const incomeStats = await Project.aggregate([
            {
                $match: { manager: userId, status: 'Completed' }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: '$projectValue' }
                }
            }
        ]);

        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const lastMonthIncomeStats = await Project.aggregate([
            {
                $match: {
                    manager: userId,
                    status: 'Completed',
                    completionDate: { $gte: lastMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    lastMonthIncome: { $sum: '$projectValue' }
                }
            }
        ]);
        
        const totalIncome = incomeStats.length > 0 ? incomeStats[0].totalIncome : 0;
        const lastMonthIncome = lastMonthIncomeStats.length > 0 ? lastMonthIncomeStats[0].lastMonthIncome : 0;
        
        const totalClientReceived = totalProjects;
        const totalImportData = 0; 

        const stats = {
            totalProjects,
            currentProjects,
            completedProjects,
            remainingProjects,
            teamEmployee: totalEmployees,
            totalTls,
            totalIncome,
            lastMonthIncome,
            totalClientReceived,
            delayedProjects,
            totalImportData
        };
    } else if (userRole === 'team_lead') {
        // Team lead dashboard
        const teams = await Team.find({ teamLeads: userId }).populate('executives');
        const teamMembers = new Set();
        teams.forEach(team => {
            team.executives.forEach(executive => {
                teamMembers.add(executive._id.toString());
            });
        });
        const teamEmployeeCount = teamMembers.size;

        const currentProjects = await Project.countDocuments({ manager: userId, status: 'Current' });
        const completedProjects = await Project.countDocuments({ manager: userId, status: 'Completed' });
        const remainingProjects = await Project.countDocuments({ manager: userId, status: { $in: ['Pending', 'Delayed'] } });

        // upcoming Projects list
        upcomingProjects = await Project.find({ manager: userId, status: { $in: ['Pending', 'Current', 'Delayed'] } })
            .select('companyName invoiceNumber serviceName startDate endDate')
            .sort({ startDate: 1 });

        stats = {
            teamEmployee: teamEmployeeCount,
            currentProjects,
            completedProjects,
            remainingProjects,
        };
    }

    res.status(200).json({
        status: 'success',
        data: {
            stats,
            upcomingProjects
        }
    });
});