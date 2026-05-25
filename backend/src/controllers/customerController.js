import User from '../models/User.js';
import Provider from '../models/Provider.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Review from '../models/Review.js';
import { Payment } from '../models/SupportingModels.js';
import { getDbStatus } from '../config/db.js';
import { mockDb, mockStore } from '../services/mockDb.js';

// Helper to calculate distance in KM between coordinates (mock geospatial search)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// @desc    Get nearby service providers
// @route   GET /api/customer/providers/nearby
// @access  Private (or Public)
export const getNearbyProviders = async (req, res) => {
  const { lat, lng, radiusInKm = 10, category } = req.query;
  const customerLat = parseFloat(lat || 12.9716);
  const customerLng = parseFloat(lng || 77.5946);

  try {
    const dbStatus = getDbStatus();
    let matchedProviders = [];

    if (dbStatus.isMockMode) {
      // Manual filter based on distance
      const allProviders = mockStore.providers.filter(p => p.kycStatus === 'verified');
      
      const mapped = allProviders.map(p => {
        const pUser = mockStore.users.find(u => u._id === p.user);
        const distance = calculateDistance(
          customerLat,
          customerLng,
          pUser?.location?.coordinates[1] || 12.9716,
          pUser?.location?.coordinates[0] || 77.5946
        );
        return {
          ...p,
          user: pUser ? { _id: pUser._id, name: pUser.name, avatar: pUser.avatar, email: pUser.email, phone: pUser.phone, location: pUser.location } : null,
          distance: parseFloat(distance.toFixed(2))
        };
      });

      // Filter by radius and category
      matchedProviders = mapped.filter(item => {
        if (category && item.category !== category) return false;
        return item.distance <= parseFloat(radiusInKm);
      });

      // Sort by distance
      matchedProviders.sort((a, b) => a.distance - b.distance);

    } else {
      // MongoDB - Find verified providers matching category
      const providerFilter = { kycStatus: 'verified' };
      if (category) providerFilter.category = category;
      
      const providers = await Provider.find(providerFilter).lean();
      const userIds = providers.map(p => p.user);
      
      // Find active user profiles for these providers
      const matchingUsers = await User.find({
        _id: { $in: userIds },
        role: 'provider',
        status: 'active'
      }).select('-password').lean();

      // Calculate distance and map
      matchedProviders = providers.map(p => {
        const u = matchingUsers.find(user => user._id.toString() === p.user.toString());
        if (!u) return null;

        const distance = calculateDistance(
          customerLat,
          customerLng,
          u.location?.coordinates[1] || 12.9716,
          u.location?.coordinates[0] || 77.5946
        );
        return {
          ...p,
          user: u,
          distance: parseFloat(distance.toFixed(2))
        };
      }).filter(Boolean);

      // Filter by radius
      matchedProviders = matchedProviders.filter(item => item.distance <= parseFloat(radiusInKm));

      // Sort by distance
      matchedProviders.sort((a, b) => a.distance - b.distance);
    }

    return res.status(200).json({ success: true, count: matchedProviders.length, data: matchedProviders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve nearby providers', error: error.message });
  }
};

// @desc    Search providers with keywords and filters
// @route   GET /api/customer/providers/search
// @access  Public
export const searchProviders = async (req, res) => {
  const { query, category, minRating, maxPrice, lat, lng } = req.query;
  const cLat = parseFloat(lat || 12.9716);
  const cLng = parseFloat(lng || 77.5946);

  try {
    const dbStatus = getDbStatus();
    let results = [];

    // AI smart search tag matching simulation
    let categorySearch = category || '';
    if (query && !category) {
      const q = query.toLowerCase();
      if (q.includes('leak') || q.includes('pipe') || q.includes('tap') || q.includes('sink') || q.includes('clog')) {
        categorySearch = 'plumber';
      } else if (q.includes('wire') || q.includes('switch') || q.includes('fuse') || q.includes('light') || q.includes('bulb')) {
        categorySearch = 'electrician';
      } else if (q.includes('clean') || q.includes('dust') || q.includes('wash') || q.includes('broom')) {
        categorySearch = 'cleaner';
      } else if (q.includes('wood') || q.includes('chair') || q.includes('table') || q.includes('door') || q.includes('hinge')) {
        categorySearch = 'carpenter';
      } else if (q.includes('wall') || q.includes('paint') || q.includes('color') || q.includes('brush')) {
        categorySearch = 'painter';
      } else if (q.includes('ac') || q.includes('cool') || q.includes('filter') || q.includes('compressor')) {
        categorySearch = 'ac_technician';
      } else if (q.includes('drill') || q.includes('hang') || q.includes('mount') || q.includes('tv') || q.includes('fix')) {
        categorySearch = 'home_repair';
      }
    }

    if (dbStatus.isMockMode) {
      let providers = [...mockStore.providers];

      // Filters
      if (categorySearch) {
        providers = providers.filter(p => p.category === categorySearch);
      }
      if (minRating) {
        providers = providers.filter(p => p.rating >= parseFloat(minRating));
      }
      if (maxPrice) {
        providers = providers.filter(p => p.hourlyRate <= parseFloat(maxPrice));
      }

      results = providers.map(p => {
        const pUser = mockStore.users.find(u => u._id === p.user);
        const distance = calculateDistance(
          cLat, cLng,
          pUser?.location?.coordinates[1] || 12.9716,
          pUser?.location?.coordinates[0] || 77.5946
        );

        return {
          ...p,
          user: pUser ? { _id: pUser._id, name: pUser.name, avatar: pUser.avatar, email: pUser.email, phone: pUser.phone } : null,
          distance: parseFloat(distance.toFixed(2))
        };
      });

      // Filter out if user search query text matched profile names
      if (query && !categorySearch) {
        const q = query.toLowerCase();
        results = results.filter(r => 
          r.user?.name.toLowerCase().includes(q) || 
          r.bio.toLowerCase().includes(q) ||
          r.businessName.toLowerCase().includes(q) ||
          r.skills.some(s => s.toLowerCase().includes(q))
        );
      }
    } else {
      // MongoDB filters
      const filter = { kycStatus: 'verified' };
      if (categorySearch) filter.category = categorySearch;
      if (minRating) filter.rating = { $gte: parseFloat(minRating) };
      if (maxPrice) filter.hourlyRate = { $lte: parseFloat(maxPrice) };

      if (query && !categorySearch) {
        // Regex search
        const regex = new RegExp(query, 'i');
        filter.$or = [
          { businessName: regex },
          { bio: regex },
          { skills: { $in: [regex] } }
        ];
      }

      const providers = await Provider.find(filter).populate({
        path: 'user',
        select: '-password'
      }).lean();

      results = providers.map(p => {
        const distance = calculateDistance(
          cLat, cLng,
          p.user?.location?.coordinates[1] || 12.9716,
          p.user?.location?.coordinates[0] || 77.5946
        );
        return {
          ...p,
          distance: parseFloat(distance.toFixed(2))
        };
      });
    }

    return res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Search failed', error: error.message });
  }
};

// @desc    Create a booking
// @route   POST /api/customer/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const { providerId, serviceName, basePrice, bookingDate, timeSlot, address, notes, totalAmount } = req.body;

  if (!providerId || !serviceName || !bookingDate || !timeSlot || !address || !totalAmount) {
    return res.status(400).json({ success: false, message: 'Required booking details are missing' });
  }

  try {
    const dbStatus = getDbStatus();
    let booking;

    if (dbStatus.isMockMode) {
      booking = mockDb.bookings.create({
        customer: req.user._id,
        provider: providerId,
        service: { name: serviceName, category: req.body.category || 'repair', basePrice },
        bookingDate: new Date(bookingDate),
        timeSlot,
        address,
        totalAmount,
        notes,
        status: 'pending'
      });
    } else {
      booking = await Booking.create({
        customer: req.user._id,
        provider: providerId,
        service: { name: serviceName, category: req.body.category || 'repair', basePrice },
        bookingDate: new Date(bookingDate),
        timeSlot,
        address,
        totalAmount,
        notes,
        status: 'pending'
      });

      // Notification
      const provider = await Provider.findById(providerId);
      if (provider) {
        // Create dynamic notification
        // Note: we can use a helper, but writing directly to DB for simplicity
        const UserNotification = (await import('../models/SupportingModels.js')).Notification;
        await UserNotification.create({
          recipient: provider.user,
          title: 'New Booking Request',
          message: `${req.user.name} has requested a booking for ${serviceName}.`,
          type: 'booking_request',
          link: `/provider/dashboard`
        });
      }
    }

    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to create booking', error: error.message });
  }
};

// @desc    Get customer booking history
// @route   GET /api/customer/bookings
// @access  Private
export const getBookings = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let bookings = [];

    if (dbStatus.isMockMode) {
      bookings = mockStore.bookings.filter(b => b.customer === req.user._id);
      
      // Populate mock provider user info
      bookings = bookings.map(b => {
        const prov = mockStore.providers.find(p => p._id === b.provider);
        const provUser = mockStore.users.find(u => u._id === prov?.user);
        return {
          ...b,
          provider: prov ? {
            _id: prov._id,
            businessName: prov.businessName,
            user: provUser ? { _id: provUser._id, name: provUser.name, avatar: provUser.avatar, phone: provUser.phone } : null
          } : null
        };
      });
    } else {
      bookings = await Booking.find({ customer: req.user._id })
        .populate({
          path: 'provider',
          populate: { path: 'user', select: 'name avatar phone' }
        })
        .sort('-createdAt');
    }

    return res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve bookings' });
  }
};

// @desc    Get booking details
// @route   GET /api/customer/bookings/:id
// @access  Private
export const getBookingDetails = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let booking;

    if (dbStatus.isMockMode) {
      booking = mockStore.bookings.find(b => b._id === req.params.id);
      if (booking) {
        const prov = mockStore.providers.find(p => p._id === booking.provider);
        const provUser = mockStore.users.find(u => u._id === prov?.user);
        booking = {
          ...booking,
          provider: prov ? {
            _id: prov._id,
            businessName: prov.businessName,
            user: provUser ? { _id: provUser._id, name: provUser.name, avatar: provUser.avatar, phone: provUser.phone } : null
          } : null
        };
      }
    } else {
      booking = await Booking.findById(req.params.id)
        .populate({
          path: 'provider',
          populate: { path: 'user', select: 'name avatar phone' }
        })
        .populate('customer', 'name phone email avatar');
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel booking
// @route   POST /api/customer/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let booking;

    if (dbStatus.isMockMode) {
      booking = mockStore.bookings.find(b => b._id === req.params.id);
      if (booking) {
        booking.status = 'cancelled';
        
        // Notify provider
        const prov = mockStore.providers.find(p => p._id === booking.provider);
        if (prov) {
          mockDb.notifications.create({
            recipient: prov.user,
            title: 'Booking Cancelled',
            message: `Customer ${req.user.name} cancelled the booking for ${booking.service.name}.`,
            type: 'booking_status',
            link: '/provider/dashboard'
          });
        }
      }
    } else {
      booking = await Booking.findById(req.params.id);
      if (booking) {
        if (booking.status !== 'pending' && booking.status !== 'accepted') {
          return res.status(400).json({ success: false, message: 'Booking cannot be cancelled now' });
        }
        booking.status = 'cancelled';
        await booking.save();

        // Notify provider
        const ProviderModel = await Provider.findById(booking.provider);
        if (ProviderModel) {
          const UserNotification = (await import('../models/SupportingModels.js')).Notification;
          await UserNotification.create({
            recipient: ProviderModel.user,
            title: 'Booking Cancelled',
            message: `Booking has been cancelled by ${req.user.name}.`,
            type: 'booking_status',
            link: `/provider/dashboard`
          });
        }
      }
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Cancellation failed', error: error.message });
  }
};

// @desc    Simulate stripe/razorpay payment
// @route   POST /api/customer/payments/create
// @access  Private
export const createPaymentSimulated = async (req, res) => {
  const { bookingId, gateway } = req.body;

  try {
    const dbStatus = getDbStatus();
    let booking;

    if (dbStatus.isMockMode) {
      booking = mockStore.bookings.find(b => b._id === bookingId);
      if (booking) {
        booking.paymentStatus = 'paid';
        const payment = {
          _id: 'pay_' + Math.random().toString(36).substr(2, 9),
          booking: bookingId,
          customer: req.user._id,
          provider: booking.provider,
          amount: booking.totalAmount,
          currency: 'INR',
          gateway: gateway || 'stripe_simulated',
          transactionId: 'txn_' + Math.random().toString(36).substr(2, 12).toUpperCase(),
          status: 'success',
          createdAt: new Date()
        };
        mockStore.payments.push(payment);
        
        // Notify provider of payment
        const prov = mockStore.providers.find(p => p._id === booking.provider);
        if (prov) {
          mockDb.notifications.create({
            recipient: prov.user,
            title: 'Payment Received',
            message: `Payment of ₹${booking.totalAmount} received for job ${booking.service.name}.`,
            type: 'payment_received',
            link: '/provider/dashboard'
          });
        }
        return res.status(200).json({ success: true, message: 'Simulated payment successful', data: payment });
      }
    } else {
      booking = await Booking.findById(bookingId);
      if (booking) {
        booking.paymentStatus = 'paid';
        await booking.save();

        const payment = await Payment.create({
          booking: bookingId,
          customer: req.user._id,
          provider: booking.provider,
          amount: booking.totalAmount,
          currency: 'INR',
          gateway: gateway || 'stripe_simulated',
          transactionId: 'txn_' + Math.random().toString(36).substr(2, 12).toUpperCase(),
          status: 'success'
        });

        // Notify provider
        const ProviderModel = await Provider.findById(booking.provider);
        if (ProviderModel) {
          const UserNotification = (await import('../models/SupportingModels.js')).Notification;
          await UserNotification.create({
            recipient: ProviderModel.user,
            title: 'Payment Received',
            message: `Payment of ₹${booking.totalAmount} has been credited for your service.`,
            type: 'payment_received',
            link: `/provider/dashboard`
          });
        }
        return res.status(200).json({ success: true, message: 'Simulated payment successful', data: payment });
      }
    }

    return res.status(404).json({ success: false, message: 'Booking not found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Payment simulation failed', error: error.message });
  }
};

// @desc    Submit provider review
// @route   POST /api/customer/reviews
// @access  Private
export const submitReview = async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  try {
    const dbStatus = getDbStatus();
    let booking;

    if (dbStatus.isMockMode) {
      booking = mockStore.bookings.find(b => b._id === bookingId);
      if (booking) {
        const review = mockDb.reviews.create({
          booking: bookingId,
          customer: req.user._id,
          provider: booking.provider,
          rating,
          comment
        });
        return res.status(201).json({ success: true, data: review });
      }
    } else {
      booking = await Booking.findById(bookingId);
      if (booking) {
        const review = await Review.create({
          booking: bookingId,
          customer: req.user._id,
          provider: booking.provider,
          rating,
          comment
        });

        // Re-calculate provider average rating
        const allReviews = await Review.find({ provider: booking.provider });
        const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

        await Provider.findByIdAndUpdate(booking.provider, {
          rating: parseFloat(avg.toFixed(1)),
          reviewCount: allReviews.length
        });

        return res.status(201).json({ success: true, data: review });
      }
    }

    return res.status(404).json({ success: false, message: 'Booking not found for review' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Review submission failed' });
  }
};

// @desc    Get provider profile details
// @route   GET /api/customer/providers/:id
// @access  Public
export const getProviderProfile = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let provider;
    let reviews = [];

    if (dbStatus.isMockMode) {
      provider = mockStore.providers.find(p => p._id === req.params.id);
      if (provider) {
        const pUser = mockStore.users.find(u => u._id === provider.user);
        provider = {
          ...provider,
          user: pUser ? { _id: pUser._id, name: pUser.name, avatar: pUser.avatar, email: pUser.email, phone: pUser.phone, location: pUser.location } : null
        };
        
        reviews = mockStore.reviews.filter(r => r.provider === req.params.id).map(r => {
          const cUser = mockStore.users.find(u => u._id === r.customer);
          return {
            ...r,
            customer: cUser ? { name: cUser.name, avatar: cUser.avatar } : null
          };
        });
      }
    } else {
      provider = await Provider.findById(req.params.id).populate('user', '-password').lean();
      if (provider) {
        reviews = await Review.find({ provider: req.params.id })
          .populate('customer', 'name avatar')
          .sort('-createdAt');
      }
    }

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    return res.status(200).json({ success: true, data: { provider, reviews } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
};

// @desc    Toggle favorite provider
// @route   POST /api/customer/providers/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let favorites = [];

    if (dbStatus.isMockMode) {
      const user = mockStore.users.find(u => u._id === req.user._id);
      if (user) {
        if (!user.favorites) user.favorites = [];
        
        const idx = user.favorites.indexOf(req.params.id);
        if (idx > -1) {
          user.favorites.splice(idx, 1);
        } else {
          user.favorites.push(req.params.id);
        }
        favorites = user.favorites;
      }
    } else {
      const user = await User.findById(req.user._id);
      const idx = user.favorites.indexOf(req.params.id);
      if (idx > -1) {
        user.favorites.splice(idx, 1);
      } else {
        user.favorites.push(req.params.id);
      }
      await user.save();
      favorites = user.favorites;
    }

    return res.status(200).json({ success: true, data: favorites, message: 'Favorites updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error updating favorites' });
  }
};
