/**
 * Server entry point
 * Handles application startup, database connection, and graceful shutdown
 */

import { App } from './app';
import { config } from './config/env';
import { databaseService } from './services/database/DatabaseService';

// Create app instance
const app = new App();

/**
 * Start server
 */
async function startServer(): Promise<void> {
  try {
    // Connect to database
    console.log('📦 Connecting to database...');
    await databaseService.connect();
    console.log('✅ Database connected');

    // Start server
    app.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`📝 Environment: ${config.NODE_ENV}`);
      console.log(`🌐 Health check: http://localhost:${config.PORT}/health`);
      console.log(`📚 API: http://localhost:${config.PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  try {
    // Close database connection
    await databaseService.disconnect();
    console.log('✅ Database disconnected');

    // Exit process
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  console.error('❌ Unhandled Rejection:', reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
startServer();


