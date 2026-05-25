import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Provider from '../models/Provider.js';
import { getDbStatus } from '../config/db.js';
import { mockDb } from '../services/mockDb.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforhyperlocalservicebookingplatform123456789';

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password, role, phone, category, address } = req.body;

  try {
    const dbStatus = getDbStatus();

    // 1. Check if user already exists
    let existingUser;
    if (dbStatus.isMockMode) {
      existingUser = mockDb.users.findOne({ email });
    } else {
      existingUser = await User.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // 2. Create base user
    let user;
    if (dbStatus.isMockMode) {
      user = mockDb.users.create({
        name,
        email,
        password,
        role: role || 'customer',
        phone,
        address: address || {},
        location: { type: 'Point', coordinates: [77.5946 + (Math.random() - 0.5) * 0.1, 12.9716 + (Math.random() - 0.5) * 0.1] }
      });
    } else {
      user = await User.create({
        name,
        email,
        password,
        role: role || 'customer',
        phone,
        address: address || {},
        location: { type: 'Point', coordinates: [77.5946 + (Math.random() - 0.5) * 0.1, 12.9716 + (Math.random() - 0.5) * 0.1] }
      });
    }

    // 3. Create provider profile if role is provider
    let provider = null;
    if (role === 'provider') {
      if (!category) {
        return res.status(400).json({ success: false, message: 'Category is required for service providers' });
      }

      if (dbStatus.isMockMode) {
        provider = mockDb.providers.create({
          user: user._id,
          businessName: `${name} Services`,
          category,
          skills: [category],
          experienceYears: 1
        });
      } else {
        provider = await Provider.create({
          user: user._id,
          businessName: `${name} Services`,
          category,
          skills: [category],
          experienceYears: 1
        });
      }
    }

    // Sign Token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        location: user.location,
        providerProfile: provider
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const dbStatus = getDbStatus();
    let user;

    if (dbStatus.isMockMode) {
      user = mockDb.users.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Verify Password
    let isMatch = false;
    if (dbStatus.isMockMode) {
      isMatch = bcrypt.compareSync(password, user.password);
    } else {
      isMatch = await user.comparePassword(password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended by an administrator' });
    }

    // Fetch provider profile if provider
    let providerProfile = null;
    if (user.role === 'provider') {
      if (dbStatus.isMockMode) {
        providerProfile = mockDb.providers.findOne({ user: user._id });
      } else {
        providerProfile = await Provider.findOne({ user: user._id });
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        location: user.location,
        providerProfile
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let providerProfile = null;

    if (req.user.role === 'provider') {
      if (dbStatus.isMockMode) {
        providerProfile = mockDb.providers.findOne({ user: req.user._id });
      } else {
        providerProfile = await Provider.findOne({ user: req.user._id });
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        avatar: req.user.avatar,
        address: req.user.address,
        location: req.user.location,
        favorites: req.user.favorites,
        providerProfile
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};
