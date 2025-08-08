const express = require('express');
const reportController = require('../controllers/reportController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('manager'));

router.get('/team-report', reportController.getTeamReport);
router.get('/team-report/projects/:userId', reportController.getMemberProjects);

module.exports = router;
