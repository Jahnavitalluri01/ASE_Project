import express from 'express';
import bookingController from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { verifyAdmin } from '../middleware/admin.js';

const router = express.Router();

// Create a booking
router.post('/request', bookingController.createBooking);

// Get unavailable dates for a provider
router.get('/unavailable-dates/:providerId', bookingController.getUnavailableDates);

router.get('/customer/:customerId', bookingController.getCustomerBookings);

router.put('/update/:bookingId', bookingController.updateBooking);

router.get("/all", verifyToken, verifyAdmin, bookingController.getAllBookings);

router.put("/cancel/:id", bookingController.cancelBooking);

// Get bookings for provider (optional status filter)
router.get('/provider/:providerId', bookingController.getProviderBookings);

// Accept or reject booking
router.put('/status/:bookingId', bookingController.updateBookingStatus);

// Get upcoming approved bookings for the next 7 days
router.get('/provider/:providerId/upcoming-approved', bookingController.getUpcomingApprovedBookings);

// Get all approved
//  bookings grouped by service
router.get('/provider/:providerId/approved-by-service', bookingController.getApprovedBookingsGroupedByService);

// Start service from provider side
router.patch('/start/:id', bookingController.startService);

// Complete service from provider side
router.patch('/complete/:id', bookingController.completeService);

//Payment service
router.post('/create-checkout-session', bookingController.createCheckoutSession);

router.patch('/mark-paid/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE bookings SET payment_status = true WHERE id = $1`, [id]);
    res.status(200).json({ message: 'Booking marked as paid' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});


export default router;
