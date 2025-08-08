const express = require('express');
const receivedDataController = require('../controllers/receivedDataController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes and restrict to managers
router.use(authController.protect);
router.use(authController.restrictTo('manager'));

router.route('/')
  .get(receivedDataController.getAllReceivedData)
  .post(receivedDataController.createReceivedData);

router.route('/:id')
  .get(receivedDataController.getReceivedData)
  .patch(receivedDataController.updateReceivedData)
  .delete(receivedDataController.deleteReceivedData);

module.exports = router;