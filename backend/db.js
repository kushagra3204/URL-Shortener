const dotenv = require('dotenv');
const path = require('path');
const { Pool } = require('pg');

dotenv.config({
  path: path.join(__dirname, 'dev.env'),
});

try {
    const pool = new Pool({
      host: process.env.HOST,
      user: process.env.USER,
      port: process.env.PORT,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    });
    module.exports = pool;
  } catch (error) {
    console.error('Error creating database pool:', error);
}
  