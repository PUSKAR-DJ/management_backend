const express = require('express');
const salaryController = require('../controllers/salaryController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('manager'));

router.route('/')
  .get(salaryController.getAllSalaries);

router.route('/:userId')
  .post(salaryController.addSalaryPayment);

module.exports = router;