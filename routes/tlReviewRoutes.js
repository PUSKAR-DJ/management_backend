const express = require('express');
const tlReviewController = require('../controllers/tlReviewController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect routes for TL only
router.use(authController.protect);
router.use(authController.restrictTo('TL'));

router.get('/', tlReviewController.getFilteredReviews);

module.exports = router;