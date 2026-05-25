import express from 'express';
import { protect } from '../middlewares/auth.js';
import { getDbStatus } from '../config/db.js';
import { mockDb, mockStore } from '../services/mockDb.js';
import { Chat, Notification } from '../models/SupportingModels.js';

const router = express.Router();

router.use(protect);

// --- NOTIFICATIONS ---
// @desc    Get user notifications
// @route   GET /api/notifications
router.get('/notifications', async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let list = [];
    if (dbStatus.isMockMode) {
      list = mockDb.notifications.find({ recipient: req.user._id });
    } else {
      list = await Notification.find({ recipient: req.user._id }).sort('-createdAt');
    }
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    if (dbStatus.isMockMode) {
      mockDb.notifications.findByIdAndUpdate(req.params.id, { isRead: true });
    } else {
      await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    }
    return res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notification' });
  }
});

// --- CHAT HISTORY ---
// @desc    Get booking chat history
// @route   GET /api/chat/:bookingId
router.get('/chat/:bookingId', async (req, res) => {
  try {
    const dbStatus = getDbStatus();
    let list = [];
    if (dbStatus.isMockMode) {
      list = mockStore.chats.filter(c => c.booking === req.params.bookingId);
    } else {
      list = await Chat.find({ booking: req.params.bookingId }).sort('createdAt');
    }
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch chat history' });
  }
});

// @desc    Send chat message (REST fallback)
// @route   POST /api/chat
router.post('/chat', async (req, res) => {
  const { bookingId, recipientId, message } = req.body;
  if (!bookingId || !recipientId || !message) {
    return res.status(400).json({ success: false, message: 'Missing chat params' });
  }

  try {
    const dbStatus = getDbStatus();
    let chatMsg;

    if (dbStatus.isMockMode) {
      chatMsg = mockDb.chats.create({
        booking: bookingId,
        sender: req.user._id,
        recipient: recipientId,
        message
      });
    } else {
      chatMsg = await Chat.create({
        booking: bookingId,
        sender: req.user._id,
        recipient: recipientId,
        message
      });
    }

    return res.status(201).json({ success: true, data: chatMsg });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

export default router;
