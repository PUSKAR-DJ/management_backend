const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Routes for creating and getting projects. Accessible to managers and team leads.
router
    .route('/')
    .get(authController.restrictTo('manager', 'team_lead'), projectController.getAllProjects)
    .post(authController.restrictTo('manager', 'team_lead'), projectController.createProject);

router
    .route('/payout')
    .get(authController.restrictTo('manager'), projectController.getProjectPayout);

// Routes for specific projects.
router
    .route('/:id')
    .get(authController.restrictTo('manager', 'team_lead'), projectController.getProject)
    .patch(authController.restrictTo('manager', 'team_lead'), projectController.updateProject)
    .delete(authController.restrictTo('manager'), projectController.deleteProject); // Only managers can delete projects

// New route for assigning tasks within a project
router.patch(
  '/:id/assign-task',
  authController.restrictTo('manager', 'team_lead'),
  projectController.assignTask
);

module.exports = router;