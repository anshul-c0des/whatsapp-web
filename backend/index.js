const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const messageRoutes = require('./routes/messageRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


// Sample route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});
app.use('/api', messageRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
