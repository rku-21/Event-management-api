const express = require('express');
const cors = require('cors');
const eventsRouter = require('./routes/events');
const usersRouter = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Event Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      events: '/api/events',
      users: '/api/users',
    },
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    path: req.path,
  });
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

module.exports = app;
