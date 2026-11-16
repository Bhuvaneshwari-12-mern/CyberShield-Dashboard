import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.CLOUD_DB_HOST,
  port: process.env.CLOUD_DB_PORT,
  user: process.env.CLOUD_DB_USER,
  password: process.env.CLOUD_DB_PASSWORD,
  database: process.env.CLOUD_DB_NAME,
  ssl: {
    rejectUnauthorized: false 
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();
