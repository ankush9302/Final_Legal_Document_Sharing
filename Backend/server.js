const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { getBatchClients } = require('./controllers/documentController');
const shareRoutes = require('./routes/shareRoutes');
const pdfProcessingRoutes = require('./routes/pdfProcessingRoutes');
const emailStatsRoutes = require('./routes/emailStatsRoutes');
const batchRoutes = require('./routes/batchRoute'); // Route to get all batches
const http = require('http');
const WebSocketService = require('./services/websocketService');
const webhookRoutes = require('./routes/webhookRoutes');
const reports = require('./routes/reportRoutes');
// Load env vars
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
const webSocketService = new WebSocketService(server);

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      // } else {
      //   callback(new Error("Not allowed by CORS"));
      // }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', (req, res, next) => {
  // console.log(`Received ${req.method} request to ${req.originalUrl}`);
  next();
}, authRoutes);

 
app.get('/api/get-clients/:batchId', getBatchClients);


// app.use('/api/subadmins', (req, res, next) => {
//   console.log(`Received ${req.method} request to ${req.originalUrl}`);
//   next();
// }, subadminRoutes);

app.use('/api/share/:batchId', (req, res, next) => {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);
  next();
}, shareRoutes);


app.use('/api/pdf-processing', pdfProcessingRoutes);   //this is for excel and pdf both you can use to this route for uploading and processing


app.use('/api/email-stats', (req, res, next) => {
  console.log(`Received ${req.method} request to ${req.originalUrl}`);
  next();
}, emailStatsRoutes);

app.use('/api/batch' , batchRoutes); // Route to get all batches
app.use('/api/reports/',reports);
app.use('/api/webhooks', webhookRoutes); // Route to listen for incoming webhooks from mailGun 

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
