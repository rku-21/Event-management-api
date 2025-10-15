const db = require('../db');
const { eventQueries, userQueries } = require('../models/eventModel');

class EventService {
  async createEvent(eventData) {
    const { title, date_time, location, capacity } = eventData;

    const eventDate = new Date(date_time);
    const now = new Date();
    
    if (eventDate <= now) {
      throw {
        status: 400,
        message: 'Event date must be in the future',
      };
    }

    try {
      const result = await db.query(eventQueries.createEvent, [
        title,
        date_time,
        location,
        capacity,
      ]);

      return result.rows[0];
    } catch (error) {
      console.error('Error creating event:', error);
      throw {
        status: 500,
        message: 'Failed to create event',
        error: error.message,
      };
    }
  }

  
  async getEventById(eventId) {
    try {
      const eventResult = await db.query(eventQueries.getEventById, [eventId]);

      if (eventResult.rows.length === 0) {
        throw {
          status: 404,
          message: 'Event not found',
        };
      }

      const event = eventResult.rows[0];

      const usersResult = await db.query(eventQueries.getRegisteredUsers, [eventId]);

      return {
        ...event,
        registered_users: usersResult.rows,
      };
    } catch (error) {
      if (error.status) throw error;
      
      console.error('Error getting event:', error);
      throw {
        status: 500,
        message: 'Failed to retrieve event',
        error: error.message,
      };
    }
  }

  
  async registerUser(eventId, userId) {
    return await db.transaction(async (client) => {
      try {
        const eventResult = await client.query(
          `SELECT 
            e.id,
            e.title,
            e.date_time,
            e.capacity,
            COUNT(r.id)::INTEGER as registration_count
          FROM events e
          LEFT JOIN registrations r ON e.id = r.event_id
          WHERE e.id = $1
          GROUP BY e.id
          FOR UPDATE`,
          [eventId]
        );

        if (eventResult.rows.length === 0) {
          throw {
            status: 404,
            message: 'Event not found',
          };
        }

        const event = eventResult.rows[0];

        const eventDate = new Date(event.date_time);
        const now = new Date();

        if (eventDate <= now) {
          throw {
            status: 400,
            message: 'Cannot register for past events',
          };
        }

        const userResult = await client.query(userQueries.getUserById, [userId]);

        if (userResult.rows.length === 0) {
          throw {
            status: 404,
            message: 'User not found',
          };
        }

        const existingRegistration = await client.query(
          eventQueries.checkRegistration,
          [eventId, userId]
        );

        if (existingRegistration.rows.length > 0) {
          throw {
            status: 409,
            message: 'User is already registered for this event',
          };
        }

        if (event.registration_count >= event.capacity) {
          throw {
            status: 400,
            message: 'Event is full',
            details: {
              capacity: event.capacity,
              current_registrations: event.registration_count,
            },
          };
        }

        const registrationResult = await client.query(
          eventQueries.createRegistration,
          [eventId, userId]
        );

        return {
          registration: registrationResult.rows[0],
          event: {
            id: event.id,
            title: event.title,
            date_time: event.date_time,
          },
          user: userResult.rows[0],
        };
      } catch (error) {
        if (error.status) throw error;
        
        console.error('Error registering user:', error);
        throw {
          status: 500,
          message: 'Failed to register user',
          error: error.message,
        };
      }
    });
  }

  
  async cancelRegistration(eventId, userId) {
    try {
      const eventResult = await db.query(eventQueries.getEventById, [eventId]);

      if (eventResult.rows.length === 0) {
        throw {
          status: 404,
          message: 'Event not found',
        };
      }

      const userResult = await db.query(userQueries.getUserById, [userId]);

      if (userResult.rows.length === 0) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }

      const result = await db.query(eventQueries.deleteRegistration, [
        eventId,
        userId,
      ]);

      if (result.rows.length === 0) {
        throw {
          status: 404,
          message: 'Registration not found. User was not registered for this event.',
        };
      }

      return {
        message: 'Registration cancelled successfully',
        event_id: eventId,
        user_id: userId,
      };
    } catch (error) {
      if (error.status) throw error;
      
      console.error('Error cancelling registration:', error);
      throw {
        status: 500,
        message: 'Failed to cancel registration',
        error: error.message,
      };
    }
  }

  
  async getUpcomingEvents() {
    try {
      const result = await db.query(eventQueries.getUpcomingEvents);

      return result.rows.map((event) => ({
        ...event,
        remaining_capacity: event.capacity - event.registration_count,
      }));
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      throw {
        status: 500,
        message: 'Failed to retrieve upcoming events',
        error: error.message,
      };
    }
  }

  
  async getEventStats(eventId) {
    try {
      const eventResult = await db.query(eventQueries.getEventById, [eventId]);

      if (eventResult.rows.length === 0) {
        throw {
          status: 404,
          message: 'Event not found',
        };
      }

      const event = eventResult.rows[0];
      const totalRegistrations = event.registration_count;
      const remainingCapacity = event.capacity - totalRegistrations;
      const capacityUsedPercentage = ((totalRegistrations / event.capacity) * 100).toFixed(2);

      return {
        event_id: event.id,
        event_title: event.title,
        total_registrations: totalRegistrations,
        capacity: event.capacity,
        remaining_capacity: remainingCapacity,
        capacity_used_percentage: parseFloat(capacityUsedPercentage),
      };
    } catch (error) {
      if (error.status) throw error;
      
      console.error('Error getting event stats:', error);
      throw {
        status: 500,
        message: 'Failed to retrieve event statistics',
        error: error.message,
      };
    }
  }

  
  async getAllEvents() {
    try {
      const result = await db.query(eventQueries.getAllEvents);
      
      return result.rows.map((event) => ({
        ...event,
        remaining_capacity: event.capacity - event.registration_count,
      }));
    } catch (error) {
      console.error('Error getting all events:', error);
      throw {
        status: 500,
        message: 'Failed to retrieve events',
        error: error.message,
      };
    }
  }
}

 
class UserService {
  
  async createUser(userData) {
    const { name, email } = userData;

    try {
      const existingUser = await db.query(userQueries.getUserByEmail, [email]);

      if (existingUser.rows.length > 0) {
        throw {
          status: 409,
          message: 'User with this email already exists',
        };
      }

      const result = await db.query(userQueries.createUser, [name, email]);

      return result.rows[0];
    } catch (error) {
      if (error.status) throw error;
      
      console.error('Error creating user:', error);
      throw {
        status: 500,
        message: 'Failed to create user',
        error: error.message,
      };
    }
  }

  
  async getUserById(userId) {
    try {
      const result = await db.query(userQueries.getUserById, [userId]);

      if (result.rows.length === 0) {
        throw {
          status: 404,
          message: 'User not found',
        };
      }

      return result.rows[0];
    } catch (error) {
      if (error.status) throw error;
      
      console.error('Error getting user:', error);
      throw {
        status: 500,
        message: 'Failed to retrieve user',
        error: error.message,
      };
    }
  }

  
  async getAllUsers() {
    try {
      const result = await db.query(userQueries.getAllUsers);
      return result.rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw {
        status: 500,
        message: 'Failed to retrieve users',
        error: error.message,
      };
    }
  }
}

module.exports = {
  EventService: new EventService(),
  UserService: new UserService(),
};
