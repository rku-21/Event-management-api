const { UserService } = require('../services/eventsService');

/**
 * Controller for user-related operations
 */
class UsersController {
  /**
   * Create a new user
   * POST /api/users
   */
  async createUser(req, res) {
    try {
      const user = await UserService.createUser(req.body);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.error : undefined,
      });
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  async getUserById(req, res) {
    try {
      const userId = parseInt(req.params.id);
      const user = await UserService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.error : undefined,
      });
    }
  }

  /**
   * Get all users
   * GET /api/users
   */
  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
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

module.exports = new UsersController();
