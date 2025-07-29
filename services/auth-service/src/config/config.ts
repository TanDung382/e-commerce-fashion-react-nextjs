import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import type { StringValue } from 'ms';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


// Cấu hình JWT (JSON Web Token)
export const JWT_SECRET = process.env.JWT_SECRET || 'c9f874435ae03e02244a2a2f861721d71d5816165204a7cb189cee18467e4005'; 
export const JWT_EXPIRES_IN: StringValue = (process.env.JWT_EXPIRES_IN as StringValue) || '24h';

export const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:5002'; 
