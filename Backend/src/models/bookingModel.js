import pool from '../db/index.js';

export const createBooking = async ({
  customerId,
  providerId,
  serviceType,
  location,
  date,
  estimatedHours,
  sqft,
  specialRequest,
  rate
}) => {
  const baseCost =
    serviceType === 'Snow Mow'
      ? rate * estimatedHours
      : rate * sqft;

  const adminCommission = baseCost * 0.05;
  const tax = baseCost * 0.05;
  const totalCost = baseCost + adminCommission + tax;

  const query = `
    INSERT INTO bookings (
      customer_id, provider_id, service_type, location, date,
      estimated_hours, sqft, special_request, rate,
      admin_commission, tax, total_cost
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;

  const values = [
    customerId,
    providerId,
    serviceType,
    location,
    date,
    estimatedHours || null,
    sqft || null,
    specialRequest,
    rate,
    adminCommission,
    tax,
    totalCost
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getProviderUnavailableDates = async (providerId) => {
  const query = `
    SELECT date FROM bookings
    WHERE provider_id = $1
  `;
  const result = await pool.query(query, [providerId]);
  return result.rows.map(row => row.date);
};
