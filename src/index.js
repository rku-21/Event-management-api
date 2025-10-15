require('dotenv').config();
const app = require('./app');
const { checkConnection } = require('./db');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log('Checking database connection...');
    const isConnected = await checkConnection();

    if (!isConnected) {
      console.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    console.log('✓ Database connection successful');

    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
      console.log(`   API base URL: http://localhost:${PORT}/api`);
      console.log(' Available endpoints:');
      console.log('   GET    /api/events  to  Get all events');
      console.log('   GET    /api/events/upcoming  to Get upcoming events');
      console.log('   GET    /api/events/:id  to Get event by ID');
      console.log('   GET    /api/events/:id/stats  to Get event statistics');
      console.log('   POST   /api/events   to  Create new event');
      console.log('   POST   /api/events/:id/register   to Register for event');
      console.log('   POST   /api/events/:id/cancel  to Cancel registration');
      console.log('   GET    /api/users    to  Get all users');
      console.log('   GET    /api/users/:id   to Get user by ID');
      console.log('   POST   /api/users   to Create new user\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
