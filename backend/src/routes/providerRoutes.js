import express from 'express';
import {
  onboardProvider,
  getProviderBookings,
  updateBookingStatus,
  getProviderEarnings,
  updateAvailability,
  uploadPortfolio
} from '../controllers/providerController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Apply protection and provider-only validation to all routes in this router
router.use(protect);
router.use(authorize('provider'));

router.put('/onboard', onboardProvider);
router.get('/bookings', getProviderBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.get('/earnings', getProviderEarnings);
router.put('/availability', updateAvailability);
router.put('/portfolio', uploadPortfolio);

export default router;
