const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const messageRoutes = require('../routes/messageRoutes.js');

const app = express();
app.use(cors());    
app.use(express.json());

// MongoDB Connection (only connect once in serverless!)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
  console.log('MongoDB connected');
}

app.get('/', (req, res) => {
    res.send('Backend is up and running');
});

app.get('/api/ping', async (req, res) => {
  await connectDB();
  res.json({ message: 'pong' });
});

app.use('/api', async (req, res, next) => {
  await connectDB();
  messageRoutes(req, res, next);  
});

module.exports = app;
