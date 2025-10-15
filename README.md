# Event Management API

A comprehensive REST API for managing events and user registrations built with Node.js, Express, and PostgreSQL.

##  Features

- **Event Management**: Create, retrieve, and manage events
- **User Registration**: Register users for events with validation
- **Capacity Management**: Automatic enforcement of event capacity limits
- **Concurrent Registration Handling**: Safe handling of simultaneous registrations
- **Smart Validation**: Prevents double registrations and past event registrations
- **Event Statistics**: Get detailed statistics about event capacity and registrations
- **Custom Sorting**: Upcoming events sorted by date (ascending) and location (alphabetically)

##  Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd event-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=event_management
   DB_USER=postgres
   DB_PASSWORD=your_password_here

   # Connection Pool
   DB_POOL_MAX=20
   DB_POOL_MIN=5
   DB_IDLE_TIMEOUT=30000
   ```

4. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE event_management;
   ```

5. **Run database migrations**
   ```bash
   npm run migrate
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

##  API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format
All responses follow this structure:
```json
{
  "success": true/false,
  "message": "Description",
  "data": { ... }
}
```

---

##  Event Endpoints

### 1. Create Event
**POST** `/api/events`

Create a new event with validation.

**Request Body:**
```json
{
  "title": "Tech Conference 2025",
  "date_time": "2025-11-15T09:00:00Z",
  "location": "San Francisco",
  "capacity": 500
}
```

**Validations:**
- Title: 3-255 characters, required
- Date: ISO 8601 format, must be in the future
- Location: 2-255 characters, required
- Capacity: 1-1000, positive integer

**Response (201):**
```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "event_id": 1,
    "event": {
      "id": 1,
      "title": "Tech Conference 2025",
      "date_time": "2025-11-15T09:00:00.000Z",
      "location": "San Francisco",
      "capacity": 500,
      "created_at": "2025-10-15T10:00:00.000Z"
    }
  }
}
```

### 2. Get Event Details
**GET** `/api/events/:id`

Retrieve detailed information about a specific event including all registered users.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Tech Conference 2025",
    "date_time": "2025-11-15T09:00:00.000Z",
    "location": "San Francisco",
    "capacity": 500,
    "registration_count": 2,
    "created_at": "2025-10-15T10:00:00.000Z",
    "updated_at": "2025-10-15T10:00:00.000Z",
    "registered_users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "registered_at": "2025-10-15T10:30:00.000Z"
      }
    ]
  }
}
```

### 3. Register for Event
**POST** `/api/events/:id/register`

Register a user for an event.

**Request Body:**
```json
{
  "user_id": 1
}
```

**Business Rules:**
-  User cannot register twice for the same event
-  Cannot register if event is at full capacity
-  Cannot register for past events
-  Handles concurrent registrations safely

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "registration": {
      "id": 1,
      "event_id": 1,
      "user_id": 1,
      "registered_at": "2025-10-15T10:30:00.000Z"
    },
    "event": {
      "id": 1,
      "title": "Tech Conference 2025",
      "date_time": "2025-11-15T09:00:00.000Z"
    },
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
}
```

**Error Responses:**
```json

{
  "success": false,
  "message": "User is already registered for this event"
}


{
  "success": false,
  "message": "Event is full",
  "details": {
    "capacity": 500,
    "current_registrations": 500
  }
}


{
  "success": false,
  "message": "Cannot register for past events"
}
```

### 4. Cancel Registration
**POST** `/api/events/:id/cancel`

Cancel a user's registration for an event.

**Request Body:**
```json
{
  "user_id": 1
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Registration cancelled successfully",
    "event_id": 1,
    "user_id": 1
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Registration not found. User was not registered for this event."
}
```

### 5. List Upcoming Events
**GET** `/api/events/upcoming`

Get all future events with custom sorting.

**Sorting:**
1. By date (ascending) - earliest events first
2. By location (alphabetically) - for events on the same date

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 4,
      "title": "Startup Meetup",
      "date_time": "2025-10-18T18:00:00.000Z",
      "location": "Austin",
      "capacity": 50,
      "registration_count": 0,
      "remaining_capacity": 50,
      "created_at": "2025-10-15T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Web Development Workshop",
      "date_time": "2025-10-20T14:00:00.000Z",
      "location": "New York",
      "capacity": 100,
      "registration_count": 5,
      "remaining_capacity": 95,
      "created_at": "2025-10-15T10:00:00.000Z"
    }
  ]
}
```

### 6. Get Event Statistics
**GET** `/api/events/:id/stats`

Get detailed statistics about an event's capacity and registrations.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "event_id": 1,
    "event_title": "Tech Conference 2025",
    "total_registrations": 250,
    "capacity": 500,
    "remaining_capacity": 250,
    "capacity_used_percentage": 50.00
  }
}
```

### 7. Get All Events
**GET** `/api/events`

Retrieve all events (past and upcoming).

**Response (200):**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": 1,
      "title": "Tech Conference 2025",
      "date_time": "2025-11-15T09:00:00.000Z",
      "location": "San Francisco",
      "capacity": 500,
      "registration_count": 250,
      "remaining_capacity": 250,
      "created_at": "2025-10-15T10:00:00.000Z"
    }
  ]
}
```

---

## 👥 User Endpoints

### 1. Create User
**POST** `/api/users`

Create a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

**Validations:**
- Name: 2-255 characters, required
- Email: Valid email format, unique

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2025-10-15T10:00:00.000Z"
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

### 2. Get User by ID
**GET** `/api/users/:id`

Retrieve user details by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2025-10-15T10:00:00.000Z",
    "updated_at": "2025-10-15T10:00:00.000Z"
  }
}
```

### 3. Get All Users
**GET** `/api/users`

Retrieve all users.

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "created_at": "2025-10-15T10:00:00.000Z",
      "updated_at": "2025-10-15T10:00:00.000Z"
    }
  ]
}
```

---

## 🧪 Example Usage

### Using cURL

**Create an event:**
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Tech Conference 2025",
    "date_time": "2025-11-15T09:00:00Z",
    "location": "San Francisco",
    "capacity": 500
  }'
```

**Register for an event:**
```bash
curl -X POST http://localhost:3000/api/events/1/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1
  }'
```

**Get upcoming events:**
```bash
curl http://localhost:3000/api/events/upcoming
```

**Get event statistics:**
```bash
curl http://localhost:3000/api/events/1/stats
```

### Using JavaScript (fetch)

```javascript

const createUser = async () => {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    })
  });
  
  const data = await response.json();
  console.log(data);
};

// Register for event
const registerForEvent = async (eventId, userId) => {
  const response = await fetch(`http://localhost:3000/api/events/${eventId}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id: userId })
  });
  
  const data = await response.json();
  console.log(data);
};
```

---

## Project Structure

```
event-api/
├── package.json
├── .env
├── .gitignore
├── README.md
├── src/
│   ├── index.js          # Server bootstrap
│   ├── app.js            # Express app and middlewares
│   ├── db/
│   │   └── index.js      # PostgreSQL client and helpers
│   ├── routes/
│   │   ├── events.js     # Event routes
│   │   └── users.js      # User routes
│   ├── controllers/
│   │   ├── eventsController.js    # Event controllers
│   │   └── usersController.js     # User controllers
│   ├── services/
│   │   └── eventsService.js       # Business logic
│   ├── models/
│   │   └── eventModel.js          # SQL queries
│   └── validators/
│       └── eventValidators.js     # Input validation
└── migrations/
    ├── run.js                      # Migration runner
    ├── 001_initial_schema.sql      # Database schema
    └── 002_seed_data.sql           # Seed data
```

---

##  Business Logic Implementation

### Concurrent Registration Handling
- Uses PostgreSQL transactions with row-level locking (`FOR UPDATE`)
- Prevents race conditions when multiple users register simultaneously
- Ensures data consistency during high-traffic scenarios

### Event Capacity Management
- Validates capacity on event creation (1-1000)
- Real-time capacity checking during registration
- Atomic operations to prevent over-booking

### Custom Sorting Algorithm
- Multi-level sorting: date (ascending) → location (alphabetical)
- Implemented at database level for optimal performance
- Uses composite indexing for fast query execution

### Edge Case Handling
-  Past event validation
-  Duplicate registration prevention
-  Event capacity enforcement
-  Non-existent user/event handling
-  Invalid input validation
-  Concurrent registration safety

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date_time TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0 AND capacity <= 1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Registrations Table
```sql
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);
```

---

## 🔍 HTTP Status Codes

| Code | Description |
|------|-------------|
| 200  | Success - Request completed successfully |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input or business rule violation |
| 404  | Not Found - Resource doesn't exist |
| 409  | Conflict - Duplicate resource or constraint violation |
| 500  | Internal Server Error - Server-side error |

---

##  Testing

Test the API using tools like:
- **Postman**: Import endpoints and test interactively
- **cURL**: Command-line testing (examples above)
- **Thunder Client**: VS Code extension for API testing
- **Insomnia**: REST client for testing APIs

### Health Check
```bash
curl http://localhost:3000/health
```

---

## 🛡️ Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

---

##  Dependencies

- **express**: Web framework
- **pg**: PostgreSQL client
- **dotenv**: Environment variable management
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing

---

##  Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database credentials
3. Ensure PostgreSQL is accessible
4. Run migrations: `npm run migrate`
5. Start server: `npm start`

### Production Considerations
- Use process manager (PM2, forever)
- Set up SSL/TLS for HTTPS
- Implement rate limiting
- Add authentication/authorization
- Set up monitoring and logging
- Use connection pooling efficiently

---

##  Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run migrations
npm run migrate

# Start production server
npm start
```

---

##  License

ISC

---

##  Author

Your Name

---

##  Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request




