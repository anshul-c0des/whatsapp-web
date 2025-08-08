const express = require('express');
const router = express.Router();
const ProcessedMessage = require('../models/processedMessage');

// GET /api/chats
router.get('/chats', async (req, res) => {
  try {
    const lastMessages = await ProcessedMessage.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$wa_id",
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $project: {
          wa_id: "$_id",
          name: "$lastMessage.name", 
          lastMessage: {
            text: "$lastMessage.text",
            timestamp: "$lastMessage.timestamp",
            status: "$lastMessage.status"
          }
        }
      }
    ]);
    res.json(lastMessages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chats/:wa_id
router.get('/chats/:wa_id', async (req, res) => {
  try {
    const wa_id = req.params.wa_id;
    const messages = await ProcessedMessage.find({ wa_id }).sort({ timestamp: 1 });
    const user = {
      wa_id,
      name: messages.find(m => m.name)?.name || 'Unknown'
    };
    res.json({ user, messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/messages
router.post('/messages', async (req, res) => {
  try {
    const { wa_id, from, to, text, type, name } = req.body;
    const nameToSet = name || wa_id;

    const newMsg = new ProcessedMessage({
      wa_id,
      from,
      to,
      text,
      type: type || "text",
      timestamp: new Date(),
      message_id: "msg_" + Date.now(),
      status: "sent",
      name: nameToSet,
    });

    const saved = await newMsg.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export a function that forwards requests to the router
module.exports = (req, res, next) => {
  router(req, res, next);
};
