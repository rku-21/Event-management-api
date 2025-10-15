const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/eventsController');
const {
  createEventValidation,
  eventIdValidation,
  registerUserValidation,
  cancelRegistrationValidation,
} = require('../validators/eventValidators');

/**
 * @route   GET /api/events/upcoming
 * @desc    Get all upcoming events (sorted by date, then location)
 * @access  Public
 */
router.get('/upcoming', eventsController.getUpcomingEvents);

/**
 * @route   GET /api/events/:id/stats
 * @desc    Get event statistics
 * @access  Public
 */
router.get('/:id/stats', eventIdValidation, eventsController.getEventStats);

/**
 * @route   POST /api/events
 * @desc    Create a new event
 * @access  Public
 */
router.post('/', createEventValidation, eventsController.createEvent);

/**
 * @route   GET /api/events/:id
 * @desc    Get event details by ID
 * @access  Public
 */
router.get('/:id', eventIdValidation, eventsController.getEventById);

/**
 * @route   POST /api/events/:id/register
 * @desc    Register a user for an event
 * @access  Public
 */
router.post(
  '/:id/register',
  registerUserValidation,
  eventsController.registerUser
);

/**
 * @route   POST /api/events/:id/cancel
 * @desc    Cancel a user's registration
 * @access  Public
 */
router.post(
  '/:id/cancel',
  cancelRegistrationValidation,
  eventsController.cancelRegistration
);

/**
 * @route   GET /api/events
 * @desc    Get all events
 * @access  Public
 */
router.get('/', eventsController.getAllEvents);

module.exports = router;
