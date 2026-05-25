import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB, getDbStatus } from './config/db.js';
import { seedMockData, mockDb } from './services/mockDb.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import miscRoutes from './routes/miscRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Enable CORS for client dashboard
app.use(cors({
  origin: '*', // For demo simplicity
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// Database initialization
await connectDB();
const dbStatus = getDbStatus();
if (dbStatus.isMockMode) {
  seedMockData();
} else {
  const { seedMongoDatabase } = await import('./services/mockDb.js');
  await seedMongoDatabase();
}

// REST API mounting
app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', miscRoutes); // Mount misc routes directly under /api (chats, notifications)

// Basic status route
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    database: getDbStatus()
  });
});

// Socket.io Server Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket connection registry
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Join a room corresponding to a specific booking ID
  socket.on('join_booking_room', ({ bookingId }) => {
    socket.join(bookingId);
    console.log(`Socket ${socket.id} joined room: ${bookingId}`);
  });

  // Handle in-app real-time chat messages
  socket.on('send_chat_message', async ({ bookingId, senderId, recipientId, message }) => {
    try {
      const dbStatus = getDbStatus();
      let chatMsg;

      if (dbStatus.isMockMode) {
        chatMsg = mockDb.chats.create({
          booking: bookingId,
          sender: senderId,
          recipient: recipientId,
          message
        });
      } else {
        const { Chat } = await import('./models/SupportingModels.js');
        chatMsg = await Chat.create({
          booking: bookingId,
          sender: senderId,
          recipient: recipientId,
          message
        });
      }

      // Broadcast to room
      io.to(bookingId).emit('receive_chat_message', chatMsg);
    } catch (err) {
      console.error('Socket message save failed:', err);
    }
  });

  // Handle live location tracking of providers
  socket.on('update_provider_location', async ({ bookingId, lat, lng }) => {
    try {
      const dbStatus = getDbStatus();
      const coords = [parseFloat(lng), parseFloat(lat)];

      if (dbStatus.isMockMode) {
        mockDb.bookings.findByIdAndUpdate(bookingId, {
          tracking: {
            providerLocation: { type: 'Point', coordinates: coords }
          }
        });
      } else {
        const BookingModel = (await import('./models/Booking.js')).default;
        await BookingModel.findByIdAndUpdate(bookingId, {
          'tracking.providerLocation.coordinates': coords,
          'tracking.lastUpdated': new Date()
        });
      }

      // Broadcast location change to booking tracking room
      io.to(bookingId).emit('provider_location_changed', { lat, lng });
    } catch (err) {
      console.error('Socket location update failed:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Hyperlocal Services Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
