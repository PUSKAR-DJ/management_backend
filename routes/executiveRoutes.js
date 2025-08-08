const express = require('express');
const executiveController = require('../controllers/executiveController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('executive'));

router.get('/my-projects', executiveController.getMyProjects);
router.get('/completed-projects', executiveController.getCompletedProjects);
router.get('/my-payout', executiveController.getMyPayout);

module.exports = router;