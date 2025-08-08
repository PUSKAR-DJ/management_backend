const TLReview = require('../models/TLReview');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getFilteredReviews = catchAsync(async (req, res, next) => {
  const { month, day } = req.query;

  let filter = {};

  if (month || day) {
    filter.date = {};

    if (month) {
      filter.date.$expr = { $eq: [{ $month: "$date" }, parseInt(month)] };
    }

    if (day) {
      filter.date.$expr = {
        ...(filter.date.$expr || {}),
        $eq: [{ $dayOfMonth: "$date" }, parseInt(day)]
      };
    }

    const reviews = await TLReview.aggregate([
      { $match: filter.date }
    ]);

    return res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: reviews
    });
  }

  const reviews = await TLReview.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews
  });
});