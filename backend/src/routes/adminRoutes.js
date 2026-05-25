import express from 'express';
import {
  getPendingProviders,
  verifyProvider,
  getAllUsers,
  updateUserStatus,
  getDisputes,
  resolveDispute,
  getPlatformAnalytics
} from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Apply protection and admin-only role checking
router.use(protect);
router.use(authorize('admin'));

router.get('/providers/pending', getPendingProviders);
router.put('/providers/:id/verify', verifyProvider);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/disputes', getDisputes);
router.put('/disputes/:id', resolveDispute);
router.get('/analytics', getPlatformAnalytics);

export default router;
