require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-default-session-secret',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/your-db', // update as needed
  CLOUDINARY: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  PG: {
    database: process.env.PG_DATABASE || 'SenecaDB',
    user: process.env.PG_USER || 'SenecaDB_owner',
    password: process.env.PG_PASSWORD || 'your-pg-password',
    host: process.env.PG_HOST || 'your-pg-host',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  }
};
