const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const messageRoutes = require('../routes/messageRoutes');

const app = express();

app.use(cors({
origin: 'https://whatsapp-e13h5ej92-anshuls-projects-ad041669.vercel.app',
credentials: false
}));

app.use(express.json());

app.options('*', cors());

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

await connectDB();

app.get('/', (req, res) => {
res.send('Backend is up and running');
});

app.get('/api/ping', (req, res) => {
res.json({ message: 'pong' });
});

app.use('/api', messageRoutes);

module.exports = app;
