module.exports = {
  apps: [
    {
      name: 'logohub',
      script: 'node',
      args: 'dist/server.js',
      // Pass through ALL environment variables from the container
      env: {
        NODE_ENV: process.env.NODE_ENV || 'production',
        PORT: process.env.PORT || '3000',
        DATABASE_URL: process.env.DATABASE_URL,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        JWT_SECRET: process.env.JWT_SECRET,
        APP_URL: process.env.APP_URL,
        DB_CONNECT_RETRIES: process.env.DB_CONNECT_RETRIES,
        DB_CONNECT_RETRY_DELAY_MS: process.env.DB_CONNECT_RETRY_DELAY_MS,
        DB_LOG_ERRORS: 'true'
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      // Wait for DB to be ready before considering the app "online"
      wait_ready: true,
      listen_timeout: 30000,
      kill_timeout: 5000
    }
  ]
};
