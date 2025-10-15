const { EventService } = require('../services/eventsService');
class EventsController {
async createEvent(req, res) {
    try {
      const event = await EventService.createEvent(req.body);

      res.status(201).json({
        success: true,
        message: 'Event created successfully',
        data: {
          event_id: event.id,
          event,
        },
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.error : undefined,
      });
    }
  }
 async getEventById(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const event = await EventService.getEventById(eventId);

      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.error : undefined,
      });
    }
  }

  async registerUser(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const { user_id } = req.body;

      const result = await EventService.registerUser(eventId, user_id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        details: error.details,
        error: process.env.NODE_ENV === 'development' ? error.error : undefined,
      });
    }
  }

  async cancelRegistration(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const { user_id } = req.body;

      const result = await EventService.cancelRegistration(eventId, user_id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.error : undefined,
      });
    }
  }

  async getUpcomingEvents(req, res) {
    try {
      const events = await EventService.getUpcomingEvents();

      res.status(200).json({
        success: true,
        count: events.length,
        data: events,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.error : undefined,
      });
    }
  }

  async getEventStats(req, res) {
    try {
      const eventId = parseInt(req.params.id);
      const stats = await EventService.getEventStats(eventId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.error : undefined,
      });
    }
  }

  async getAllEvents(req, res) {
    try {
      const events = await EventService.getAllEvents();

      res.status(200).json({
        success: true,
        count: events.length,
        data: events,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.error : undefined,
      });
    }
  }
}

module.exports = new EventsController();
