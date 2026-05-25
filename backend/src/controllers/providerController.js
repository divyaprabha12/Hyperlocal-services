import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { mockDb, mockStore } from '../services/mockDb.js';

// @desc    Complete onboarding & update KYC profile
// @route   PUT /api/provider/onboard
// @access  Private
export const onboardProvider = async (req, res) => {
  const { businessName, bio, skills, hourlyRate, experienceYears, docUrl } = req.body;

  try {
    const dbStatus = getDbStatus();
    let provider;

    if (dbStatus.isMockMode) {
      provider = mockStore.providers.find(p => p.user === req.user._id);
      if (provider) {
        provider.businessName = businessName || provider.businessName;
        provider.bio = bio || provider.bio;
        provider.skills = skills || provider.skills;
        provider.hourlyRate = hourlyRate ? parseFloat(hourlyRate) : provider.hourlyRate;
        provider.experienceYears = experienceYears ? parseInt(experienceYears) : provider.experienceYears;
        provider.kycStatus = 'verified'; // Auto-verify in mock mode for instant demo
        provider.kycDocument = { docType: 'LICENSE', docUrl: docUrl || 'https://img.icons8.com/color/120/driver-license.png' };
      }
    } else {
      provider = await Provider.findOne({ user: req.user._id });
      if (provider) {
        provider.businessName = businessName || provider.businessName;
        provider.bio = bio || provider.bio;
        provider.skills = skills || provider.skills;
        provider.hourlyRate = hourlyRate ? parseFloat(hourlyRate) : provider.hourlyRate;
        provider.experienceYears = experienceYears ? parseInt(experienceYears) : provider.experienceYears;
        provider.kycStatus = 'pending'; // Requires admin validation in real DB
        provider.kycDocument = { docType: 'LICENSE', docUrl: docUrl || '' };
        await provider.save();
      }
    }

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully', data: provider });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Onboarding failed', error: error.message });
  }
};

// @desc    Get provider jobs / bookings
// @route   GET /api/provider/bookings
// @access  Private
export const getProviderBookings = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let bookings = [];

    if (dbStatus.isMockMode) {
      const provider = mockStore.providers.find(p => p.user === req.user._id);
      if (provider) {
        bookings = mockStore.bookings.filter(b => b.provider === provider._id);
        
        // Populate customer user details
        bookings = bookings.map(b => {
          const custUser = mockStore.users.find(u => u._id === b.customer);
          return {
            ...b,
            customer: custUser ? { _id: custUser._id, name: custUser.name, avatar: custUser.avatar, phone: custUser.phone } : null
          };
        });
      }
    } else {
      const provider = await Provider.findOne({ user: req.user._id });
      if (provider) {
        bookings = await Booking.find({ provider: provider._id })
          .populate('customer', 'name avatar phone email')
          .sort('-createdAt');
      }
    }

    return res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
};

// @desc    Update booking status (accept, reject, start_work, complete with OTP)
// @route   PUT /api/provider/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  const { status, otp } = req.body;
  const validTransitions = ['accepted', 'rejected', 'in_progress', 'completed'];

  if (!validTransitions.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid target status' });
  }

  try {
    const dbStatus = getDbStatus();
    let booking;

    if (dbStatus.isMockMode) {
      booking = mockStore.bookings.find(b => b._id === req.params.id);
      if (booking) {
        // OTP Validation for completion
        if (status === 'completed') {
          if (!otp || booking.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid verification OTP code' });
          }
          booking.paymentStatus = 'paid'; // Complete automatically marks payment in mock
          
          // Increment completed jobs count
          const prov = mockStore.providers.find(p => p._id === booking.provider);
          if (prov) prov.completedJobs += 1;
        }
        
        booking.status = status;
        
        // Notify customer
        mockDb.notifications.create({
          recipient: booking.customer,
          title: `Job Update: ${status}`,
          message: `Your booking for ${booking.service.name} has been marked as ${status}.`,
          type: 'booking_status',
          link: '/customer/dashboard'
        });
      }
    } else {
      booking = await Booking.findById(req.params.id);
      if (booking) {
        // OTP Check
        if (status === 'completed') {
          if (!otp || booking.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid verification OTP code' });
          }
          booking.paymentStatus = 'paid';
          
          // Increment provider counter
          await Provider.findByIdAndUpdate(booking.provider, { $inc: { completedJobs: 1 } });
        }

        booking.status = status;
        await booking.save();

        // Notify customer
        const UserNotification = (await import('../models/SupportingModels.js')).Notification;
        await UserNotification.create({
          recipient: booking.customer,
          title: `Job Update: ${status}`,
          message: `Your booking for ${booking.service.name} is now ${status.replace('_', ' ')}.`,
          type: 'booking_status',
          link: `/customer/bookings/${booking._id}`
        });
      }
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.status(200).json({ success: true, message: 'Job status updated', data: booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Status transition failed', error: error.message });
  }
};

// @desc    Get provider earnings data
// @route   GET /api/provider/earnings
// @access  Private
export const getProviderEarnings = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let completedJobs = [];
    let provider;

    if (dbStatus.isMockMode) {
      provider = mockStore.providers.find(p => p.user === req.user._id);
      if (provider) {
        completedJobs = mockStore.bookings.filter(b => b.provider === provider._id && b.status === 'completed');
      }
    } else {
      provider = await Provider.findOne({ user: req.user._id });
      if (provider) {
        completedJobs = await Booking.find({ provider: provider._id, status: 'completed' });
      }
    }

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    // Aggregate values
    const totalEarnings = completedJobs.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const platformFee = Math.round(totalEarnings * 0.15); // 15% platform commission
    const netEarnings = totalEarnings - platformFee;

    // Simulated weekly distribution for UI graph
    const weeklyData = [
      { day: 'Mon', amount: Math.round(netEarnings * 0.1) },
      { day: 'Tue', amount: Math.round(netEarnings * 0.15) },
      { day: 'Wed', amount: Math.round(netEarnings * 0.2) },
      { day: 'Thu', amount: Math.round(netEarnings * 0.05) },
      { day: 'Fri', amount: Math.round(netEarnings * 0.25) },
      { day: 'Sat', amount: Math.round(netEarnings * 0.25) },
      { day: 'Sun', amount: 0 }
    ];

    return res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        platformFee,
        netEarnings,
        jobsCount: completedJobs.length,
        weeklyData
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve earnings' });
  }
};

// @desc    Update weekly availability
// @route   PUT /api/provider/availability
// @access  Private
export const updateAvailability = async (req, res) => {
  const { days, slots, isAvailableNow } = req.body;

  try {
    const dbStatus = getDbStatus();
    let provider;

    if (dbStatus.isMockMode) {
      provider = mockStore.providers.find(p => p.user === req.user._id);
      if (provider) {
        if (days) provider.availability.days = days;
        if (slots) provider.availability.slots = slots;
        if (isAvailableNow !== undefined) provider.isAvailableNow = isAvailableNow;
      }
    } else {
      provider = await Provider.findOne({ user: req.user._id });
      if (provider) {
        if (days) provider.availability.days = days;
        if (slots) provider.availability.slots = slots;
        if (isAvailableNow !== undefined) provider.isAvailableNow = isAvailableNow;
        await provider.save();
      }
    }

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    return res.status(200).json({ success: true, message: 'Availability schedule saved', data: provider });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to update schedule' });
  }
};

// @desc    Add work item to portfolio
// @route   PUT /api/provider/portfolio
// @access  Private
export const uploadPortfolio = async (req, res) => {
  const { title, imageUrl, description } = req.body;

  if (!title || !imageUrl) {
    return res.status(400).json({ success: false, message: 'Title and image are required' });
  }

  try {
    const dbStatus = getDbStatus();
    let provider;

    if (dbStatus.isMockMode) {
      provider = mockStore.providers.find(p => p.user === req.user._id);
      if (provider) {
        provider.portfolio.push({ title, imageUrl, description });
      }
    } else {
      provider = await Provider.findOne({ user: req.user._id });
      if (provider) {
        provider.portfolio.push({ title, imageUrl, description });
        await provider.save();
      }
    }

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    return res.status(200).json({ success: true, message: 'Portfolio item added', data: provider.portfolio });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to upload portfolio' });
  }
};
