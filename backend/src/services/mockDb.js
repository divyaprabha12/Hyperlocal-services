// Simulated database in-memory for zero-config demonstration fallback
import bcrypt from 'bcryptjs';

const hashPasswordSync = (password) => {
  return bcrypt.hashSync(password, 10);
};

export const mockStore = {
  users: [],
  providers: [],
  services: [],
  bookings: [],
  payments: [],
  reviews: [],
  notifications: [],
  chats: [],
  disputes: []
};

// Seed Initial Data
export const seedMockData = () => {
  console.log('Seeding simulated in-memory database...');

  // 1. Seed Services
  const baseServices = [
    { _id: 's1', name: 'Expert House Wiring & Repair', category: 'electrician', basePrice: 250, description: 'Complete electrical troubleshooting, wiring replacements, and smart switches installations.', durationEstimate: '1-3 hours', popularityScore: 92 },
    { _id: 's2', name: 'Leaking Pipes & Tap Repair', category: 'plumber', basePrice: 150, description: 'Fix water leakages, replace rusted pipes, and install premium bathroom/kitchen faucets.', durationEstimate: '1-2 hours', popularityScore: 88 },
    { _id: 's3', name: 'Deep Home Cleaning', category: 'cleaner', basePrice: 500, description: 'Thorough sanitation of kitchens, bathrooms, bedrooms, and carpets with professional equipment.', durationEstimate: '3-5 hours', popularityScore: 96 },
    { _id: 's4', name: 'Custom Wooden Cabinets & Repairs', category: 'carpenter', basePrice: 300, description: 'Repairing creaking hinges, resizing doors, or custom modular wardrobe alignment.', durationEstimate: '2-4 hours', popularityScore: 80 },
    { _id: 's5', name: 'Wall Painting & Texturing', category: 'painter', basePrice: 800, description: 'Premium premium emulsions, feature wall styling, and dampness repairs before painting.', durationEstimate: '1-3 days', popularityScore: 78 },
    { _id: 's6', name: 'AC Deep Jet Service', category: 'ac_technician', basePrice: 350, description: 'High-pressure water cleaning of outdoor/indoor coils, gas pressure checks, and filter cleanup.', durationEstimate: '1-2 hours', popularityScore: 95 },
    { _id: 's7', name: 'Wall Mounted TV & Decor Install', category: 'home_repair', basePrice: 120, description: 'Secure wall mounts for TVs, painting hangings, mirror fixtures, and drilling tasks.', durationEstimate: '30-60 mins', popularityScore: 85 }
  ];
  mockStore.services = baseServices;

  // 2. Seed Users (Admins, Customers, Providers)
  const users = [
    {
      _id: 'u_admin',
      name: 'Sarah Jenkins (Admin)',
      email: 'admin@hyperlocal.com',
      password: hashPasswordSync('admin123'),
      role: 'admin',
      phone: '+919988776655',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      address: { street: '12, MG Road', city: 'Bangalore', state: 'Karnataka', zip: '560001' },
      location: { type: 'Point', coordinates: [77.5946, 12.9716] },
      status: 'active'
    },
    {
      _id: 'u_cust1',
      name: 'Alex Rivera',
      email: 'alex@gmail.com',
      password: hashPasswordSync('alex123'),
      role: 'customer',
      phone: '+918877665544',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      address: { street: '24, Indiranagar 100ft Rd', city: 'Bangalore', state: 'Karnataka', zip: '560038' },
      location: { type: 'Point', coordinates: [77.6413, 12.9718] },
      status: 'active',
      favorites: ['prov1']
    },
    {
      _id: 'u_cust2',
      name: 'Rohan Sharma',
      email: 'rohan@gmail.com',
      password: hashPasswordSync('rohan123'),
      role: 'customer',
      phone: '+917766554433',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      address: { street: '45, HSR Layout Sector 4', city: 'Bangalore', state: 'Karnataka', zip: '560102' },
      location: { type: 'Point', coordinates: [77.6309, 12.9128] },
      status: 'active',
      favorites: []
    },
    // Providers mapped to their User accounts
    {
      _id: 'u_prov1',
      name: 'David Miller',
      email: 'david.electric@gmail.com',
      password: hashPasswordSync('david123'),
      role: 'provider',
      phone: '+919665544332',
      avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150',
      address: { street: '5, Koramangala 8th Block', city: 'Bangalore', state: 'Karnataka', zip: '560095' },
      location: { type: 'Point', coordinates: [77.6245, 12.9352] }, // 1.5km from Indiranagar
      status: 'active'
    },
    {
      _id: 'u_prov2',
      name: 'Marcus Chen',
      email: 'marcus.plumb@gmail.com',
      password: hashPasswordSync('marcus123'),
      role: 'provider',
      phone: '+919554433221',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      address: { street: '78, Domlur Flyover Rd', city: 'Bangalore', state: 'Karnataka', zip: '560071' },
      location: { type: 'Point', coordinates: [77.6387, 12.9610] }, // 0.8km from Indiranagar
      status: 'active'
    },
    {
      _id: 'u_prov3',
      name: 'Clara Oswald',
      email: 'clara.clean@gmail.com',
      password: hashPasswordSync('clara123'),
      role: 'provider',
      phone: '+919443322110',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
      address: { street: '220, Ejipura Main Rd', city: 'Bangalore', state: 'Karnataka', zip: '560047' },
      location: { type: 'Point', coordinates: [77.6253, 12.9389] },
      status: 'active'
    },
    {
      _id: 'u_prov4',
      name: 'Raj Kumar',
      email: 'raj.repair@gmail.com',
      password: hashPasswordSync('raj123'),
      role: 'provider',
      phone: '+919332211009',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      address: { street: '31, Ulsoor Lake Road', city: 'Bangalore', state: 'Karnataka', zip: '560008' },
      location: { type: 'Point', coordinates: [77.6200, 12.9800] },
      status: 'active'
    }
  ];
  mockStore.users = users;

  // 3. Seed Providers Detailed profiles
  const providers = [
    {
      _id: 'prov1',
      user: 'u_prov1', // Ref User ID
      businessName: 'Miller Electric & Smart Automation',
      category: 'electrician',
      skills: ['Smart Home Setup', 'HVAC Wiring', 'Fuse Box Repair', 'Short Circuit Detection'],
      experienceYears: 6,
      bio: 'Certified Master Electrician with 6 years experience in smart home upgrades and complex electrical troubleshooting. Fast, tidy, and reliable.',
      kycStatus: 'verified',
      kycDocument: { docType: 'LICENSE', docUrl: 'https://img.icons8.com/color/120/driver-license.png' },
      hourlyRate: 300,
      rating: 4.8,
      reviewCount: 2,
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        slots: ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00']
      },
      isAvailableNow: true,
      portfolio: [
        { title: 'Modular Kitchen Wiring', imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200', description: 'Rewired an old kitchen with modular touch controls and heavy appliances support.' },
        { title: 'Industrial Fuse Upgrade', imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200', description: 'Replaced an ancient 3-phase switchboard with high-speed circuit breakers.' }
      ],
      completedJobs: 42
    },
    {
      _id: 'prov2',
      user: 'u_prov2',
      businessName: 'Marcus Leak-Proof Plumbers',
      category: 'plumber',
      skills: ['Bathroom Tap Fixing', 'Clogged Drain Cleansing', 'Gas Pipeline Leak Test', 'Sewer Clean'],
      experienceYears: 8,
      bio: 'Expert commercial and home plumber. Equipped with advanced pipe cameras to spot and seal leakages in minutes without breaking walls.',
      kycStatus: 'verified',
      kycDocument: { docType: 'PASSPORT', docUrl: 'https://img.icons8.com/color/120/passport.png' },
      hourlyRate: 180,
      rating: 4.9,
      reviewCount: 1,
      availability: {
        days: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
        slots: ['08:00-12:00', '12:00-16:00', '16:00-20:00']
      },
      isAvailableNow: true,
      portfolio: [
        { title: 'Clogged Bathroom Restructuring', imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=200', description: 'Completely unblocked bathroom sewage pipe using hydro-jet machinery.' }
      ],
      completedJobs: 56
    },
    {
      _id: 'prov3',
      user: 'u_prov3',
      businessName: 'Clara Premium Cleaners',
      category: 'cleaner',
      skills: ['Deep Kitchen Sanitization', 'Sofa & Carpet Shampooing', 'Disinfection', 'Post-Paint Clean'],
      experienceYears: 4,
      bio: 'We use 100% eco-friendly certified chemicals and high-frequency vacuum systems. Spotless cleanliness guaranteed.',
      kycStatus: 'pending',
      kycDocument: { docType: 'AADHAAR', docUrl: 'https://img.icons8.com/color/120/identity-card.png' },
      hourlyRate: 450,
      rating: 4.5,
      reviewCount: 0,
      availability: {
        days: ['Friday', 'Saturday', 'Sunday'],
        slots: ['09:00-14:00', '14:00-19:00']
      },
      isAvailableNow: false,
      portfolio: [],
      completedJobs: 18
    },
    {
      _id: 'prov4',
      user: 'u_prov4',
      businessName: 'Raj Home Repair Hub',
      category: 'home_repair',
      skills: ['TV Wall Mount', 'Chandelier Hanging', 'Wall Painting Patch', 'Door Adjustments'],
      experienceYears: 10,
      bio: 'All-in-one home repair service. From mounting heavy items securely on drywall to fixing wooden squeaks. Over 10 years serving Bangalore.',
      kycStatus: 'verified',
      kycDocument: { docType: 'LICENSE', docUrl: 'https://img.icons8.com/color/120/driver-license.png' },
      hourlyRate: 150,
      rating: 4.6,
      reviewCount: 1,
      availability: {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        slots: ['08:00-11:00', '11:00-14:00', '14:00-17:00', '17:00-20:00']
      },
      isAvailableNow: true,
      portfolio: [],
      completedJobs: 98
    }
  ];
  mockStore.providers = providers;

  // 4. Seed Reviews
  const reviews = [
    {
      _id: 'rev1',
      booking: 'b1',
      customer: 'u_cust1',
      provider: 'prov1',
      rating: 5,
      comment: 'Excellent service! David Miller arrived on time, was extremely polite, and diagnosed a wire short-circuit that two other electricians missed. Highly recommended!',
      reply: 'Thanks Alex! Glad I could resolve the issue quickly.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'rev2',
      booking: 'b2',
      customer: 'u_cust2',
      provider: 'prov1',
      rating: 4,
      comment: 'Did a very neat job installing smart switches. Cleaned up the wall plaster after drill work. Will hire again.',
      reply: '',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'rev3',
      booking: 'b3',
      customer: 'u_cust1',
      provider: 'prov2',
      rating: 5,
      comment: 'Marcus fixed my kitchen pipe within 30 minutes! Truly a lifesaver.',
      reply: 'Happy to help anytime!',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ];
  mockStore.reviews = reviews;

  // 5. Seed Bookings
  const bookings = [
    {
      _id: 'b1',
      customer: 'u_cust1',
      provider: 'prov1',
      service: { name: 'Expert House Wiring & Repair', category: 'electrician', basePrice: 250 },
      bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      timeSlot: '09:00-12:00',
      status: 'completed',
      address: { street: '24, Indiranagar 100ft Rd', city: 'Bangalore', state: 'Karnataka', zip: '560038' },
      location: { type: 'Point', coordinates: [77.6413, 12.9718] },
      totalAmount: 300,
      paymentStatus: 'paid',
      notes: 'Need smart switchboards checked as well.',
      otp: '4821',
      tracking: { providerLocation: { type: 'Point', coordinates: [77.6413, 12.9718] }, lastUpdated: new Date() },
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'b2',
      customer: 'u_cust2',
      provider: 'prov1',
      service: { name: 'Expert House Wiring & Repair', category: 'electrician', basePrice: 250 },
      bookingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      timeSlot: '12:00-15:00',
      status: 'completed',
      address: { street: '45, HSR Layout Sector 4', city: 'Bangalore', state: 'Karnataka', zip: '560102' },
      location: { type: 'Point', coordinates: [77.6309, 12.9128] },
      totalAmount: 250,
      paymentStatus: 'paid',
      notes: 'No comments',
      otp: '1159',
      tracking: { providerLocation: { type: 'Point', coordinates: [77.6309, 12.9128] }, lastUpdated: new Date() },
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'b3',
      customer: 'u_cust1',
      provider: 'prov2',
      service: { name: 'Leaking Pipes & Tap Repair', category: 'plumber', basePrice: 150 },
      bookingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      timeSlot: '12:00-16:00',
      status: 'completed',
      address: { street: '24, Indiranagar 100ft Rd', city: 'Bangalore', state: 'Karnataka', zip: '560038' },
      location: { type: 'Point', coordinates: [77.6413, 12.9718] },
      totalAmount: 180,
      paymentStatus: 'paid',
      notes: 'Kitchen sink pipe is dripping continuously.',
      otp: '7829',
      tracking: { providerLocation: { type: 'Point', coordinates: [77.6413, 12.9718] }, lastUpdated: new Date() },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      _id: 'b4_active',
      customer: 'u_cust1',
      provider: 'prov1',
      service: { name: 'Expert House Wiring & Repair', category: 'electrician', basePrice: 250 },
      bookingDate: new Date(),
      timeSlot: '18:00-21:00',
      status: 'in_progress',
      address: { street: '24, Indiranagar 100ft Rd', city: 'Bangalore', state: 'Karnataka', zip: '560038' },
      location: { type: 'Point', coordinates: [77.6413, 12.9718] },
      totalAmount: 300,
      paymentStatus: 'pending',
      notes: 'Main power box trips when geyser is turned on.',
      otp: '5641',
      tracking: {
        providerLocation: { type: 'Point', coordinates: [77.6295, 12.9450] }, // Provider moving towards customer
        lastUpdated: new Date()
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ];
  mockStore.bookings = bookings;

  // 6. Seed Notifications
  const notifications = [
    { _id: 'n1', recipient: 'u_cust1', title: 'Booking Confirmed', message: 'Your booking for AC deep jet service has been accepted by Marcus Chen.', type: 'booking_status', isRead: false, link: '/customer/bookings/b3', createdAt: new Date() },
    { _id: 'n2', recipient: 'u_prov1', title: 'New Booking Request', message: 'You have a new job request for Expert House Wiring from Alex Rivera.', type: 'booking_request', isRead: false, link: '/provider/jobs', createdAt: new Date() }
  ];
  mockStore.notifications = notifications;

  console.log('Seed completed successfully. Users:', mockStore.users.length, 'Providers:', mockStore.providers.length);
};

// Help Helper Query API functions
export const mockDb = {
  users: {
    find: (filter = {}) => {
      let list = [...mockStore.users];
      if (filter.role) list = list.filter(u => u.role === filter.role);
      return list;
    },
    findOne: (filter) => {
      return mockStore.users.find(u => {
        if (filter.email && u.email === filter.email) return true;
        if (filter._id && u._id === filter._id) return true;
        return false;
      });
    },
    findById: (id) => mockStore.users.find(u => u._id === id),
    create: (data) => {
      const newUser = {
        _id: 'u_' + Math.random().toString(36).substr(2, 9),
        favorites: [],
        status: 'active',
        location: { type: 'Point', coordinates: [77.5946, 12.9716] },
        createdAt: new Date(),
        ...data,
        password: hashPasswordSync(data.password)
      };
      mockStore.users.push(newUser);
      return newUser;
    },
    findByIdAndUpdate: (id, updates) => {
      const user = mockStore.users.find(u => u._id === id);
      if (user) Object.assign(user, updates);
      return user;
    }
  },
  providers: {
    find: (filter = {}) => {
      let list = [...mockStore.providers];
      if (filter.category) list = list.filter(p => p.category === filter.category);
      if (filter.kycStatus) list = list.filter(p => p.kycStatus === filter.kycStatus);
      return list;
    },
    findOne: (filter) => {
      return mockStore.providers.find(p => {
        if (filter.user && p.user === filter.user) return true;
        if (filter._id && p._id === filter._id) return true;
        return false;
      });
    },
    findById: (id) => mockStore.providers.find(p => p._id === id),
    create: (data) => {
      const newProv = {
        _id: 'prov_' + Math.random().toString(36).substr(2, 9),
        kycStatus: 'pending',
        rating: 5.0,
        reviewCount: 0,
        completedJobs: 0,
        portfolio: [],
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          slots: ['09:00-12:00', '12:00-15:00', '15:00-18:00']
        },
        isAvailableNow: true,
        createdAt: new Date(),
        ...data
      };
      mockStore.providers.push(newProv);
      return newProv;
    },
    findByIdAndUpdate: (id, updates) => {
      const prov = mockStore.providers.find(p => p._id === id);
      if (prov) {
        // Deep merger for nested objects if required
        if (updates.availability) {
          prov.availability = { ...prov.availability, ...updates.availability };
          delete updates.availability;
        }
        Object.assign(prov, updates);
      }
      return prov;
    }
  },
  services: {
    find: (filter = {}) => {
      let list = [...mockStore.services];
      if (filter.category) list = list.filter(s => s.category === filter.category);
      return list;
    },
    findById: (id) => mockStore.services.find(s => s._id === id),
    create: (data) => {
      const newServ = { _id: 's_' + Math.random().toString(36).substr(2, 9), ...data };
      mockStore.services.push(newServ);
      return newServ;
    }
  },
  bookings: {
    find: (filter = {}) => {
      let list = [...mockStore.bookings];
      if (filter.customer) list = list.filter(b => b.customer === filter.customer);
      if (filter.provider) list = list.filter(b => b.provider === filter.provider);
      return list;
    },
    findById: (id) => mockStore.bookings.find(b => b._id === id),
    create: (data) => {
      const newBook = {
        _id: 'b_' + Math.random().toString(36).substr(2, 9),
        status: 'pending',
        paymentStatus: 'pending',
        otp: Math.floor(1000 + Math.random() * 9000).toString(),
        createdAt: new Date(),
        tracking: { providerLocation: { type: 'Point', coordinates: [77.5946, 12.9716] }, lastUpdated: new Date() },
        ...data
      };
      mockStore.bookings.push(newBook);
      
      // Auto-trigger notifications
      const customer = mockStore.users.find(u => u._id === data.customer);
      const provider = mockStore.providers.find(p => p._id === data.provider);
      if (provider) {
        mockDb.notifications.create({
          recipient: provider.user,
          title: 'New Booking Request',
          message: `${customer?.name || 'A customer'} has booked your service for ${data.bookingDate}`,
          type: 'booking_request',
          link: '/provider/dashboard'
        });
      }
      return newBook;
    },
    findByIdAndUpdate: (id, updates) => {
      const book = mockStore.bookings.find(b => b._id === id);
      if (book) {
        if (updates.tracking) {
          book.tracking = { ...book.tracking, ...updates.tracking, lastUpdated: new Date() };
          delete updates.tracking;
        }
        Object.assign(book, updates);
      }
      return book;
    }
  },
  reviews: {
    find: (filter = {}) => {
      let list = [...mockStore.reviews];
      if (filter.provider) list = list.filter(r => r.provider === filter.provider);
      if (filter.customer) list = list.filter(r => r.customer === filter.customer);
      return list;
    },
    create: (data) => {
      const newReview = {
        _id: 'rev_' + Math.random().toString(36).substr(2, 9),
        reply: '',
        createdAt: new Date(),
        ...data
      };
      mockStore.reviews.push(newReview);
      
      // Update provider rating dynamically in mock
      const prov = mockStore.providers.find(p => p._id === data.provider);
      if (prov) {
        const provReviews = mockStore.reviews.filter(r => r.provider === data.provider);
        const sum = provReviews.reduce((acc, curr) => acc + curr.rating, 0);
        prov.rating = parseFloat((sum / provReviews.length).toFixed(1));
        prov.reviewCount = provReviews.length;
      }
      return newReview;
    }
  },
  notifications: {
    find: (filter = {}) => {
      let list = [...mockStore.notifications];
      if (filter.recipient) list = list.filter(n => n.recipient === filter.recipient);
      return list.sort((a,b) => b.createdAt - a.createdAt);
    },
    findByIdAndUpdate: (id, updates) => {
      const notif = mockStore.notifications.find(n => n._id === id);
      if (notif) Object.assign(notif, updates);
      return notif;
    },
    create: (data) => {
      const newNotif = {
        _id: 'n_' + Math.random().toString(36).substr(2, 9),
        isRead: false,
        createdAt: new Date(),
        ...data
      };
      mockStore.notifications.push(newNotif);
      return newNotif;
    }
  },
  chats: {
    find: (filter = {}) => {
      let list = [...mockStore.chats];
      if (filter.booking) list = list.filter(c => c.booking === filter.booking);
      return list;
    },
    create: (data) => {
      const newChat = {
        _id: 'c_' + Math.random().toString(36).substr(2, 9),
        isRead: false,
        createdAt: new Date(),
        ...data
      };
      mockStore.chats.push(newChat);
      return newChat;
    }
  },
  disputes: {
    find: (filter = {}) => {
      return [...mockStore.disputes];
    },
    findById: (id) => mockStore.disputes.find(d => d._id === id),
    create: (data) => {
      const newDisp = {
        _id: 'disp_' + Math.random().toString(36).substr(2, 9),
        status: 'open',
        resolutionDetails: '',
        createdAt: new Date(),
        ...data
      };
      mockStore.disputes.push(newDisp);
      return newDisp;
    },
    findByIdAndUpdate: (id, updates) => {
      const disp = mockStore.disputes.find(d => d._id === id);
      if (disp) Object.assign(disp, updates);
      return disp;
    }
  }
};

export const seedMongoDatabase = async () => {
  try {
    const User = (await import('../models/User.js')).default;
    const Provider = (await import('../models/Provider.js')).default;
    const Service = (await import('../models/Service.js')).default;
    const Booking = (await import('../models/Booking.js')).default;
    const Review = (await import('../models/Review.js')).default;

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('MongoDB has existing users. Seeding skipped.');
      return;
    }

    console.log('MongoDB is empty. Initializing database collections with seed data...');

    // 1. Seed Services
    const baseServices = [
      { _id: 's1', name: 'Expert House Wiring & Repair', category: 'electrician', basePrice: 250, description: 'Complete electrical troubleshooting, wiring replacements, and smart switches installations.', durationEstimate: '1-3 hours', popularityScore: 92 },
      { _id: 's2', name: 'Leaking Pipes & Tap Repair', category: 'plumber', basePrice: 150, description: 'Fix water leakages, replace rusted pipes, and install premium bathroom/kitchen faucets.', durationEstimate: '1-2 hours', popularityScore: 88 },
      { _id: 's3', name: 'Deep Home Cleaning', category: 'cleaner', basePrice: 500, description: 'Thorough sanitation of kitchens, bathrooms, bedrooms, and carpets with professional equipment.', durationEstimate: '3-5 hours', popularityScore: 96 },
      { _id: 's4', name: 'Custom Wooden Cabinets & Repairs', category: 'carpenter', basePrice: 300, description: 'Repairing creaking hinges, resizing doors, or custom modular wardrobe alignment.', durationEstimate: '2-4 hours', popularityScore: 80 },
      { _id: 's5', name: 'Wall Painting & Texturing', category: 'painter', basePrice: 800, description: 'Premium premium emulsions, feature wall styling, and dampness repairs before painting.', durationEstimate: '1-3 days', popularityScore: 78 },
      { _id: 's6', name: 'AC Deep Jet Service', category: 'ac_technician', basePrice: 350, description: 'High-pressure water cleaning of outdoor/indoor coils, gas pressure checks, and filter cleanup.', durationEstimate: '1-2 hours', popularityScore: 95 },
      { _id: 's7', name: 'Wall Mounted TV & Decor Install', category: 'home_repair', basePrice: 120, description: 'Secure wall mounts for TVs, painting hangings, mirror fixtures, and drilling tasks.', durationEstimate: '30-60 mins', popularityScore: 85 }
    ];
    await Service.insertMany(baseServices);

    // 2. Seed Users
    const users = [
      {
        _id: 'u_admin',
        name: 'Sarah Jenkins (Admin)',
        email: 'admin@hyperlocal.com',
        password: hashPasswordSync('admin123'),
        role: 'admin',
        phone: '+919988776655',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        address: { street: '12, MG Road', city: 'Bangalore', state: 'Karnataka', zip: '560001' },
        location: { type: 'Point', coordinates: [77.5946, 12.9716] },
        status: 'active'
      },
      {
        _id: 'u_cust1',
        name: 'Alex Rivera',
        email: 'alex@gmail.com',
        password: hashPasswordSync('alex123'),
        role: 'customer',
        phone: '+918877665544',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        address: { street: '24, Indiranagar 100ft Rd', city: 'Bangalore', state: 'Karnataka', zip: '560038' },
        location: { type: 'Point', coordinates: [77.6413, 12.9718] },
        status: 'active',
        favorites: ['prov1']
      },
      {
        _id: 'u_cust2',
        name: 'Rohan Sharma',
        email: 'rohan@gmail.com',
        password: hashPasswordSync('rohan123'),
        role: 'customer',
        phone: '+917766554433',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        address: { street: '45, HSR Layout Sector 4', city: 'Bangalore', state: 'Karnataka', zip: '560102' },
        location: { type: 'Point', coordinates: [77.6309, 12.9128] },
        status: 'active',
        favorites: []
      },
      {
        _id: 'u_prov1',
        name: 'David Miller',
        email: 'david.electric@gmail.com',
        password: hashPasswordSync('david123'),
        role: 'provider',
        phone: '+919665544332',
        avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150',
        address: { street: '5, Koramangala 8th Block', city: 'Bangalore', state: 'Karnataka', zip: '560095' },
        location: { type: 'Point', coordinates: [77.6245, 12.9352] },
        status: 'active'
      },
      {
        _id: 'u_prov2',
        name: 'Marcus Chen',
        email: 'marcus.plumb@gmail.com',
        password: hashPasswordSync('marcus123'),
        role: 'provider',
        phone: '+919554433221',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
        address: { street: '78, Domlur Flyover Rd', city: 'Bangalore', state: 'Karnataka', zip: '560071' },
        location: { type: 'Point', coordinates: [77.6387, 12.9610] },
        status: 'active'
      },
      {
        _id: 'u_prov3',
        name: 'Clara Oswald',
        email: 'clara.clean@gmail.com',
        password: hashPasswordSync('clara123'),
        role: 'provider',
        phone: '+919443322110',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150',
        address: { street: '220, Ejipura Main Rd', city: 'Bangalore', state: 'Karnataka', zip: '560047' },
        location: { type: 'Point', coordinates: [77.6253, 12.9389] },
        status: 'active'
      },
      {
        _id: 'u_prov4',
        name: 'Raj Kumar',
        email: 'raj.repair@gmail.com',
        password: hashPasswordSync('raj123'),
        role: 'provider',
        phone: '+919332211009',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        address: { street: '31, Ulsoor Lake Road', city: 'Bangalore', state: 'Karnataka', zip: '560008' },
        location: { type: 'Point', coordinates: [77.6200, 12.9800] },
        status: 'active'
      }
    ];

    // Using User.create to bypass manual password pre-save, but since password is pre-hashed, we can insert directly or save:
    // Actually, to bypass pre-save hashing since they are already hashed in mockStore:
    // We can just save them. But wait, User.insertMany does not trigger pre-save hooks so they wont get re-hashed!
    await User.insertMany(users);

    // 3. Seed Providers
    const providers = [
      {
        _id: 'prov1',
        user: 'u_prov1',
        businessName: 'Miller Electric & Smart Automation',
        category: 'electrician',
        skills: ['Smart Home Setup', 'HVAC Wiring', 'Fuse Box Repair', 'Short Circuit Detection'],
        experienceYears: 6,
        bio: 'Certified Master Electrician with 6 years experience in smart home upgrades and complex electrical troubleshooting. Fast, tidy, and reliable.',
        kycStatus: 'verified',
        kycDocument: { docType: 'LICENSE', docUrl: 'https://img.icons8.com/color/120/driver-license.png' },
        hourlyRate: 300,
        rating: 4.8,
        reviewCount: 2,
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          slots: ['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00']
        },
        isAvailableNow: true,
        completedJobs: 42
      },
      {
        _id: 'prov2',
        user: 'u_prov2',
        businessName: 'Marcus Leak-Proof Plumbers',
        category: 'plumber',
        skills: ['Bathroom Tap Fixing', 'Clogged Drain Cleansing', 'Gas Pipeline Leak Test', 'Sewer Clean'],
        experienceYears: 8,
        bio: 'Expert commercial and home plumber. Equipped with advanced pipe cameras to spot and seal leakages in minutes without breaking walls.',
        kycStatus: 'verified',
        kycDocument: { docType: 'PASSPORT', docUrl: 'https://img.icons8.com/color/120/passport.png' },
        hourlyRate: 180,
        rating: 4.9,
        reviewCount: 1,
        availability: {
          days: ['Monday', 'Wednesday', 'Thursday', 'Friday', 'Sunday'],
          slots: ['08:00-12:00', '12:00-16:00', '16:00-20:00']
        },
        isAvailableNow: true,
        completedJobs: 56
      },
      {
        _id: 'prov3',
        user: 'u_prov3',
        businessName: 'Clara Premium Cleaners',
        category: 'cleaner',
        skills: ['Deep Kitchen Sanitization', 'Sofa & Carpet Shampooing', 'Disinfection', 'Post-Paint Clean'],
        experienceYears: 4,
        bio: 'We use 100% eco-friendly certified chemicals and high-frequency vacuum systems. Spotless cleanliness guaranteed.',
        kycStatus: 'verified', // Set to verified so it is searchable!
        kycDocument: { docType: 'AADHAAR', docUrl: 'https://img.icons8.com/color/120/identity-card.png' },
        hourlyRate: 450,
        rating: 4.5,
        reviewCount: 0,
        availability: {
          days: ['Friday', 'Saturday', 'Sunday'],
          slots: ['09:00-14:00', '14:00-19:00']
        },
        isAvailableNow: true,
        completedJobs: 18
      },
      {
        _id: 'prov4',
        user: 'u_prov4',
        businessName: 'Raj Home Repair Hub',
        category: 'home_repair',
        skills: ['TV Wall Mount', 'Chandelier Hanging', 'Wall Painting Patch', 'Door Adjustments'],
        experienceYears: 10,
        bio: 'All-in-one home repair service. From mounting heavy items securely on drywall to fixing wooden squeaks. Over 10 years serving Bangalore.',
        kycStatus: 'verified',
        kycDocument: { docType: 'LICENSE', docUrl: 'https://img.icons8.com/color/120/driver-license.png' },
        hourlyRate: 150,
        rating: 4.6,
        reviewCount: 1,
        availability: {
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          slots: ['08:00-11:00', '11:00-14:00', '14:00-17:00', '17:00-20:00']
        },
        isAvailableNow: true,
        completedJobs: 98
      }
    ];
    await Provider.insertMany(providers);

    // 4. Seed Bookings
    const bookings = [
      {
        _id: 'b1',
        customer: 'u_cust1',
        provider: 'prov1',
        service: { name: 'Expert House Wiring & Repair', category: 'electrician', basePrice: 250 },
        bookingDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        timeSlot: '09:00-12:00',
        status: 'completed',
        address: { street: '24, Indiranagar 100ft Rd', city: 'Bangalore', state: 'Karnataka', zip: '560038' },
        location: { type: 'Point', coordinates: [77.6413, 12.9718] },
        totalAmount: 300,
        paymentStatus: 'paid',
        notes: 'Need smart switchboards checked as well.',
        otp: '4821',
        tracking: { providerLocation: { type: 'Point', coordinates: [77.6413, 12.9718] }, lastUpdated: new Date() },
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'b2',
        customer: 'u_cust2',
        provider: 'prov1',
        service: { name: 'Expert House Wiring & Repair', category: 'electrician', basePrice: 250 },
        bookingDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        timeSlot: '12:00-15:00',
        status: 'completed',
        address: { street: '45, HSR Layout Sector 4', city: 'Bangalore', state: 'Karnataka', zip: '560102' },
        location: { type: 'Point', coordinates: [77.6309, 12.9128] },
        totalAmount: 250,
        paymentStatus: 'paid',
        notes: 'No comments',
        otp: '1159',
        tracking: { providerLocation: { type: 'Point', coordinates: [77.6309, 12.9128] }, lastUpdated: new Date() },
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'b3',
        customer: 'u_cust1',
        provider: 'prov2',
        service: { name: 'Leaking Pipes & Tap Repair', category: 'plumber', basePrice: 150 },
        bookingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        timeSlot: '12:00-16:00',
        status: 'completed',
        address: { street: '24, Indiranagar 100ft Rd', city: 'Bangalore', state: 'Karnataka', zip: '560038' },
        location: { type: 'Point', coordinates: [77.6413, 12.9718] },
        totalAmount: 180,
        paymentStatus: 'paid',
        notes: 'Kitchen sink pipe is dripping continuously.',
        otp: '7829',
        tracking: { providerLocation: { type: 'Point', coordinates: [77.6413, 12.9718] }, lastUpdated: new Date() },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'b4_active',
        customer: 'u_cust1',
        provider: 'prov1',
        service: { name: 'Expert House Wiring & Repair', category: 'electrician', basePrice: 250 },
        bookingDate: new Date(),
        timeSlot: '18:00-21:00',
        status: 'in_progress',
        address: { street: '24, Indiranagar 100ft Rd', city: 'Bangalore', state: 'Karnataka', zip: '560038' },
        location: { type: 'Point', coordinates: [77.6413, 12.9718] },
        totalAmount: 300,
        paymentStatus: 'pending',
        notes: 'Main power box trips when geyser is turned on.',
        otp: '5641',
        tracking: {
          providerLocation: { type: 'Point', coordinates: [77.6295, 12.9450] },
          lastUpdated: new Date()
        },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ];
    await Booking.insertMany(bookings);

    // 5. Seed Reviews
    const reviews = [
      {
        _id: 'rev1',
        booking: 'b1',
        customer: 'u_cust1',
        provider: 'prov1',
        rating: 5,
        comment: 'Excellent service! David Miller arrived on time, was extremely polite, and diagnosed a wire short-circuit that two other electricians missed. Highly recommended!',
        reply: 'Thanks Alex! Glad I could resolve the issue quickly.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'rev2',
        booking: 'b2',
        customer: 'u_cust2',
        provider: 'prov1',
        rating: 4,
        comment: 'Did a very neat job installing smart switches. Cleaned up the wall plaster after drill work. Will hire again.',
        reply: '',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        _id: 'rev3',
        booking: 'b3',
        customer: 'u_cust1',
        provider: 'prov2',
        rating: 5,
        comment: 'Marcus fixed my kitchen pipe within 30 minutes! Truly a lifesaver.',
        reply: 'Happy to help anytime!',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];
    await Review.insertMany(reviews);

    console.log('MongoDB Seeded successfully! Users:', users.length, 'Providers:', providers.length);
  } catch (err) {
    console.error('Failed to seed MongoDB database:', err);
  }
};
