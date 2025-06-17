// filepath: Backend/src/index.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pool from './db/index.js';
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();
const PORT = 5002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test DB connection
pool.query('SELECT NOW()')
  .then(res => console.log('Database time:', res.rows[0]))
  .catch(err => console.error('Database connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
