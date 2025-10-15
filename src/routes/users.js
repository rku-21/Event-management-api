const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const {
  createUserValidation,
  userIdValidation,
} = require('../validators/eventValidators');

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Public
 */
router.post('/', createUserValidation, usersController.createUser);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Public
 */
router.get('/:id', userIdValidation, usersController.getUserById);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Public
 */
router.get('/', usersController.getAllUsers);

module.exports = router;
