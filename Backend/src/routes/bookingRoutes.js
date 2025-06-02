import express from 'express';
import bookingController from '../controllers/bookingController.js';

const router = express.Router();

// Create a booking
router.post('/request', bookingController.createBooking);

// Get unavailable dates for a provider
router.get('/unavailable-dates/:providerId', bookingController.getUnavailableDates);

export default router;
