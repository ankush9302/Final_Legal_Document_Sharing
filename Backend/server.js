const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { getDocumentLinks } = require('./controllers/documentController');
const subadminRoutes = require('./routes/subadminRoutes');
const shareRoutes = require('./routes/shareRoutes');
const pdfProcessingRoutes = require('./routes/pdfProcessingRoutes');
const emailStatsRoutes = require('./routes/emailStatsRoutes');
const http = require('http');
const WebSocketService = require('./services/websocketService');
const webhookRoutes = require('./routes/webhookRoutes');

// Load env vars
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const webSocketService = new WebSocketService(server);

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', (req, res, next) => {
  // console.log(`Received ${req.method} request to ${req.originalUrl}`);
  next();
}, authRoutes);

app.get('/api/document-links', getDocumentLinks);

// app.use('/api/subadmins', (req, res, next) => {
//   console.log(`Received ${req.method} request to ${req.originalUrl}`);
//   next();
// }, subadminRoutes);

app.use('/api/share', (req, res, next) => {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);
  next();
}, shareRoutes);


app.use('/api/pdf-processing', pdfProcessingRoutes);   //this is for excel and pdf both you can use to this route for uploading and processing


app.use('/api/email-stats', (req, res, next) => {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);
  next();
}, emailStatsRoutes);

app.use('/api/webhooks', webhookRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
