import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import { Dispute } from '../models/SupportingModels.js';
import { getDbStatus } from '../config/db.js';
import { mockDb, mockStore } from '../services/mockDb.js';

// @desc    Get pending provider KYC verification tickets
// @route   GET /api/admin/providers/pending
// @access  Private (Admin only)
export const getPendingProviders = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let pending = [];

    if (dbStatus.isMockMode) {
      pending = mockStore.providers.filter(p => p.kycStatus === 'pending');
      
      // Populate user info
      pending = pending.map(p => {
        const u = mockStore.users.find(user => user._id === p.user);
        return {
          ...p,
          user: u ? { _id: u._id, name: u.name, email: u.email, phone: u.phone, avatar: u.avatar } : null
        };
      });
    } else {
      pending = await Provider.find({ kycStatus: 'pending' }).populate('user', 'name email phone avatar');
    }

    return res.status(200).json({ success: true, count: pending.length, data: pending });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch pending tickets' });
  }
};

// @desc    Verify or reject provider KYC
// @route   PUT /api/admin/providers/:id/verify
// @access  Private (Admin only)
export const verifyProvider = async (req, res) => {
  const { status } = req.body; // 'verified' or 'rejected'

  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid KYC status choice' });
  }

  try {
    const dbStatus = getDbStatus();
    let provider;

    if (dbStatus.isMockMode) {
      provider = mockStore.providers.find(p => p._id === req.params.id);
      if (provider) {
        provider.kycStatus = status;
        
        // Notify provider user
        mockDb.notifications.create({
          recipient: provider.user,
          title: `KYC Status: ${status}`,
          message: `Your verification documents have been reviewed and marked as ${status}.`,
          type: 'verification_update',
          link: '/provider/dashboard'
        });
      }
    } else {
      provider = await Provider.findByIdAndUpdate(req.params.id, { kycStatus: status }, { new: true });
      if (provider) {
        // Notify provider user
        const UserNotification = (await import('../models/SupportingModels.js')).Notification;
        await UserNotification.create({
          recipient: provider.user,
          title: `KYC Verification: ${status}`,
          message: `Your professional profile verification has been ${status}.`,
          type: 'verification_update',
          link: `/provider/dashboard`
        });
      }
    }

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    return res.status(200).json({ success: true, message: `Provider verification status is now ${status}`, data: provider });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Verification transaction failed' });
  }
};

// @desc    List all registered users
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let users = [];

    if (dbStatus.isMockMode) {
      users = [...mockStore.users];
    } else {
      users = await User.find().select('-password').sort('-createdAt');
    }

    return res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users' });
  }
};

// @desc    Suspend or activate user account
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
export const updateUserStatus = async (req, res) => {
  const { status } = req.body; // 'active' or 'suspended'

  if (!['active', 'suspended'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid account status' });
  }

  try {
    const dbStatus = getDbStatus();
    let user;

    if (dbStatus.isMockMode) {
      user = mockStore.users.find(u => u._id === req.params.id);
      if (user) {
        user.status = status;
      }
    } else {
      user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: `User status changed to ${status}`, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Operation failed' });
  }
};

// @desc    Get dispute tickets
// @route   GET /api/admin/disputes
// @access  Private (Admin only)
export const getDisputes = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let disputes = [];

    if (dbStatus.isMockMode) {
      disputes = [...mockStore.disputes];
    } else {
      disputes = await Dispute.find().sort('-createdAt');
    }

    return res.status(200).json({ success: true, data: disputes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch disputes' });
  }
};

// @desc    Resolve dispute
// @route   PUT /api/admin/disputes/:id
// @access  Private (Admin only)
export const resolveDispute = async (req, res) => {
  const { status, resolutionDetails } = req.body;

  try {
    const dbStatus = getDbStatus();
    let dispute;

    if (dbStatus.isMockMode) {
      dispute = mockStore.disputes.find(d => d._id === req.params.id);
      if (dispute) {
        dispute.status = status || dispute.status;
        dispute.resolutionDetails = resolutionDetails || dispute.resolutionDetails;
      }
    } else {
      dispute = await Dispute.findByIdAndUpdate(
        req.params.id,
        { status, resolutionDetails },
        { new: true }
      );
    }

    if (!dispute) {
      return res.status(404).json({ success: false, message: 'Dispute ticket not found' });
    }

    return res.status(200).json({ success: true, message: 'Dispute ticket updated', data: dispute });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to resolve dispute' });
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
export const getPlatformAnalytics = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let bookingsCount = 0;
    let customersCount = 0;
    let providersCount = 0;
    let totalRevenue = 0;
    let bookings = [];

    if (dbStatus.isMockMode) {
      bookings = [...mockStore.bookings];
      bookingsCount = bookings.length;
      customersCount = mockStore.users.filter(u => u.role === 'customer').length;
      providersCount = mockStore.providers.length;
      totalRevenue = bookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0);
    } else {
      bookings = await Booking.find();
      bookingsCount = bookings.length;
      customersCount = await User.countDocuments({ role: 'customer' });
      providersCount = await Provider.countDocuments();
      
      const revenueAgg = await Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      totalRevenue = revenueAgg[0]?.total || 0;
    }

    const platformCommission = Math.round(totalRevenue * 0.15); // 15% Platform take rate

    // Top categories calculation
    const categoryCounts = bookings.reduce((acc, curr) => {
      const cat = curr.service?.category || 'unknown';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    const topCategories = Object.keys(categoryCounts).map(key => ({
      name: key,
      count: categoryCounts[key]
    })).sort((a,b) => b.count - a.count);

    // Fraud logs (mock simulation based on suspicious booking cancellations/disputes)
    const fraudFlags = [
      { id: 'f1', user: 'Alex Rivera', reason: 'High cancellation velocity within 24h', risk: 'Medium' },
      { id: 'f2', user: 'Marcus Chen', reason: 'Multiple booking completions without OTP matching requests', risk: 'High' }
    ];

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          totalBookings: bookingsCount,
          activeCustomers: customersCount,
          activeProviders: providersCount,
          grossBilling: totalRevenue,
          netRevenue: platformCommission
        },
        topCategories,
        fraudFlags
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve analytics telemetry' });
  }
};
