const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('manager', 'team_lead', 'executive', 'sales_executive'));

router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;