// src/models/userModel.js
import pool from '../db/index.js';

const findByGoogleId = async (googleId) => {
  const query = `
    SELECT * FROM users WHERE google_id = $1;
  `;
  const values = [googleId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const create = async ({ googleId, email, name, picture,role,is_approved }) => {
  const query = `
    INSERT INTO users (google_id, email, name, picture,role, is_approved)
    VALUES ($1, $2, $3, $4,$5, $6)
    RETURNING *;
  `;
  const values = [googleId, email, name, picture,role,is_approved];
  const result = await pool.query(query, values);
  return result.rows[0];
};
const findById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1;`;
  const values = [id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1;`;
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0];
};
const getPendingProviders = async () => {
  const result = await pool.query(
    `SELECT * FROM users WHERE role = 'provider' AND is_approved = 'false'`
  );
  return result.rows;
};
export const approveProvider = async (userId) => {
  const query = `
    UPDATE users
    SET is_approved = true
    WHERE id = $1 AND role = 'provider'
    RETURNING *;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};


export default {
  findByGoogleId,
  create,
  findById,
  findByEmail,
  getPendingProviders,
  approveProvider
};
