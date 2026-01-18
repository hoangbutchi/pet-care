require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const connectMongoDB = require('./config/mongo');
const prisma = require('./prismaClient');

// Routes
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const shopRoutes = require('./routes/shopRoutes');
const productRoutes = require('./routes/productRoutes');
const priceRoutes = require('./routes/priceRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
// Communication Module Routes
const chatRoutes = require('./routes/chatRoutes');
const emailRoutes = require('./routes/emailRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
// Employee Management & RBAC Routes
const employeeRoutes = require('./routes/employeeRoutes');
const roleRoutes = require('./routes/roleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');

// Socket.io
const { setupChatSocket } = require('./sockets/chatSocket');

// ====================
// BƯỚC 2 – TẠO APP
// ====================
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// ====================
// KẾT NỐI DATABASE
// ====================
// connectMongoDB(); // Commented out - using PostgreSQL with Prisma

// Test PostgreSQL
async function testDB() {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL OK:', result);
  } catch (error) {
    console.error('❌ PostgreSQL lỗi:', error.message);
  }
}
testDB();

// ====================
// MIDDLEWARE
// ====================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true
}));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

// ====================
// ROUTES
// ====================
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/inventory', inventoryRoutes);
// Communication Module Routes
app.use('/api/chat', chatRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/consultations', consultationRoutes);
// Employee Management & RBAC Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

app.get('/', (req, res) => {
  res.send('Pet Care API is running...');
});

// ====================
// SOCKET.IO SETUP
// ====================
setupChatSocket(io);

// ====================
// START SERVER
// ====================
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💬 Socket.io server ready`);
});
