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
      console.log(`\n🚀 Server is running on port ${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
      console.log(`   API base URL: http://localhost:${PORT}/api`);
      console.log('\n📚 Available endpoints:');
      console.log('   GET    /api/events          - Get all events');
      console.log('   GET    /api/events/upcoming - Get upcoming events');
      console.log('   GET    /api/events/:id      - Get event by ID');
      console.log('   GET    /api/events/:id/stats - Get event statistics');
      console.log('   POST   /api/events          - Create new event');
      console.log('   POST   /api/events/:id/register - Register for event');
      console.log('   POST   /api/events/:id/cancel   - Cancel registration');
      console.log('   GET    /api/users           - Get all users');
      console.log('   GET    /api/users/:id       - Get user by ID');
      console.log('   POST   /api/users           - Create new user\n');
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
