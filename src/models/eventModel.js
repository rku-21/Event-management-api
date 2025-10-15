const db = require('../db');

/**
 * SQL queries for event operations
 */
const eventQueries = {
  // Create a new event
  createEvent: `
    INSERT INTO events (title, date_time, location, capacity)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, date_time, location, capacity, created_at
  `,

  // Get event by ID with registration count
  getEventById: `
    SELECT 
      e.id,
      e.title,
      e.date_time,
      e.location,
      e.capacity,
      e.created_at,
      e.updated_at,
      COUNT(r.id)::INTEGER as registration_count
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
    WHERE e.id = $1
    GROUP BY e.id
  `,

  // Get registered users for an event
  getRegisteredUsers: `
    SELECT 
      u.id,
      u.name,
      u.email,
      r.registered_at
    FROM users u
    INNER JOIN registrations r ON u.id = r.user_id
    WHERE r.event_id = $1
    ORDER BY r.registered_at DESC
  `,

  // Check if user is already registered
  checkRegistration: `
    SELECT id FROM registrations
    WHERE event_id = $1 AND user_id = $2
  `,

  // Create registration
  createRegistration: `
    INSERT INTO registrations (event_id, user_id)
    VALUES ($1, $2)
    RETURNING id, event_id, user_id, registered_at
  `,

  // Delete registration
  deleteRegistration: `
    DELETE FROM registrations
    WHERE event_id = $1 AND user_id = $2
    RETURNING id
  `,

  // Get upcoming events
  getUpcomingEvents: `
    SELECT 
      e.id,
      e.title,
      e.date_time,
      e.location,
      e.capacity,
      e.created_at,
      COUNT(r.id)::INTEGER as registration_count
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
    WHERE e.date_time > NOW()
    GROUP BY e.id
    ORDER BY e.date_time ASC, e.location ASC
  `,

  // Get all events
  getAllEvents: `
    SELECT 
      e.id,
      e.title,
      e.date_time,
      e.location,
      e.capacity,
      e.created_at,
      COUNT(r.id)::INTEGER as registration_count
    FROM events e
    LEFT JOIN registrations r ON e.id = r.event_id
    GROUP BY e.id
    ORDER BY e.date_time DESC
  `,
};

/**
 * SQL queries for user operations
 */
const userQueries = {
  // Create a new user
  createUser: `
    INSERT INTO users (name, email)
    VALUES ($1, $2)
    RETURNING id, name, email, created_at
  `,

  // Get user by ID
  getUserById: `
    SELECT id, name, email, created_at, updated_at
    FROM users
    WHERE id = $1
  `,

  // Get user by email
  getUserByEmail: `
    SELECT id, name, email, created_at, updated_at
    FROM users
    WHERE email = $1
  `,

  // Get all users
  getAllUsers: `
    SELECT id, name, email, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `,
};

module.exports = {
  eventQueries,
  userQueries,
};
