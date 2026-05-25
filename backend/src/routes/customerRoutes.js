import express from 'express';
import {
  getNearbyProviders,
  searchProviders,
  createBooking,
  getBookings,
  getBookingDetails,
  cancelBooking,
  createPaymentSimulated,
  submitReview,
  getProviderProfile,
  toggleFavorite
} from '../controllers/customerController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.get('/providers/search', searchProviders);
router.get('/providers/:id', getProviderProfile);

// Protected routes (Customer only)
router.get('/providers/nearby', protect, getNearbyProviders);
router.post('/bookings', protect, authorize('customer'), createBooking);
router.get('/bookings', protect, authorize('customer'), getBookings);
router.get('/bookings/:id', protect, getBookingDetails); // accessible by customer or provider
router.post('/bookings/:id/cancel', protect, authorize('customer'), cancelBooking);
router.post('/payments/create', protect, authorize('customer'), createPaymentSimulated);
router.post('/reviews', protect, authorize('customer'), submitReview);
router.post('/providers/:id/favorite', protect, authorize('customer'), toggleFavorite);

export default router;
