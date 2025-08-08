const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllSalaries = catchAsync(async (req, res, next) => {
  const users = await User.find({ 
    createdBy: req.user.id,
    role: { $ne: 'manager' } 
  }).select('name email role baseSalary salaryHistory');

  const salaryData = users.map(user => {
    const lastPayment = user.salaryHistory.length > 0 
      ? user.salaryHistory[user.salaryHistory.length - 1] 
      : null;

    return {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,

      tlName: user.role === 'team_lead' ? user.name : 'N/A', 
      amount: lastPayment ? lastPayment.amount : user.baseSalary,
      duration: lastPayment ? `${lastPayment.month} ${lastPayment.year}` : 'N/A'
    };
  });

  res.status(200).json({
    status: 'success',
    results: salaryData.length,
    data: {
      salaries: salaryData
    }
  });
});

exports.addSalaryPayment = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { amount, month, year } = req.body;

  if (!amount || !month || !year) {
    return next(new AppError('Please provide amount, month, and year.', 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  user.salaryHistory.push({
    amount,
    month,
    year,
    paidBy: req.user.id
  });

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});