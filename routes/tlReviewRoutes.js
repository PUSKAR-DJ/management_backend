const express = require('express');
const tlReviewController = require('../controllers/tlReviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('team_lead'));

router.get('/', tlReviewController.getFilteredReviews);

module.exports = router;