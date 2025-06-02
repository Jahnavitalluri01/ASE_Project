// src/controllers/bookingController.js

import * as Booking from '../models/bookingModel.js';

const bookingController = {
  // Create a new booking
  createBooking: async (req, res) => {
  // ⚠️ For testing without auth middleware
  const {
    customerId, // <-- directly from request body
    providerId,
    serviceType,
    location,
    date,
    time, // you can save this if needed
    estimatedHours,
    estimatedSqft,
    specialRequest,
    rate
  } = req.body;
  console.log(req.body)

  if (!customerId || !providerId || !serviceType || !location || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const booking = await Booking.createBooking({
      customerId,
      providerId,
      serviceType,
      location,
      date,
      estimatedHours,
      sqft: estimatedSqft,
      specialRequest,
      rate
    });

    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
},


  // Get unavailable dates for a provider
  getUnavailableDates: async (req, res) => {
    const { id } = req.params;
    try {
      const dates = await Booking.getUnavailableDates(id);
      res.json(dates);
    } catch (err) {
      console.error('Error fetching unavailable dates:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

export default bookingController;
