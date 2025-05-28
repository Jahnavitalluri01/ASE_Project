// src/db.js
import dotenv from 'dotenv';
import pkg from 'pg';
import { parse } from 'pg-connection-string';

dotenv.config();

const { Pool } = pkg;

const config = parse(process.env.DATABASE_URL);

const pool = new Pool({
  host: config.host,         // Parsed host
  port: config.port || 5432, // Ensure port is set
  user: config.user,
  password: config.password,
  database: config.database,
  ssl: {
    rejectUnauthorized: false,
  },
  family: 4, // 👈 Force IPv4
});

pool.on('connect', () => {
  console.log('✅ Connected to the PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export const query = (text, params) => {
  return pool.query(text, params);
};

export default pool;
