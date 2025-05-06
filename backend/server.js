const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store live notifications
let liveNotifications = [];

const activeStocks = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  socket.emit('initial-notifications', liveNotifications);
  
  socket.on('stock-change', (data) => {
    const { symbol, userId } = data;
    
    activeStocks.set(socket.id, { symbol, userId });
    
    socket.emit('reset-chart');
    
    console.log(`User ${userId} switched to stock: ${symbol}`);
  });
  
  // Listen for new notifications
  socket.on('new-notification', (notification) => {
    liveNotifications.unshift(notification);
    
    if (liveNotifications.length > 50) {
      liveNotifications = liveNotifications.slice(0, 50);
    }
    
    io.emit('notification-update', notification);
    
    console.log('New notification:', notification);
  });
  
  // Listen for new transactions
  socket.on('new-transaction', (transaction) => {
    io.emit('transaction-update', transaction);
    console.log('New transaction:', transaction);
  });
  
  // Handle price updates
  socket.on('price-update', (priceData) => {
    const { symbol, price, change } = priceData;
    
    io.emit('price-change', { symbol, price, change });
  });
  
  socket.on('disconnect', () => {
    activeStocks.delete(socket.id);
    console.log('Client disconnected:', socket.id);
  });
});

app.get('/api/notifications', (req, res) => {
  res.json(liveNotifications);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});