const mongoose = require('mongoose');

const ProcessedMessageSchema = new mongoose.Schema({
  wa_id: String,            // WhatsApp user ID
  from: String,
  to: String,
  text: String,
  timestamp: Date,
  message_id: String,
  meta_msg_id: String,
  status: String,           // sent, delivered, read, etc.
  type: String,
  name: String,
}, { timestamps: true });

module.exports = mongoose.model('ProcessedMessage', ProcessedMessageSchema);
