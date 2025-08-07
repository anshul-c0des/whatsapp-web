const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const ProcessedMessage = require('./models/processedMessage.js');

const payloadDir = path.join(__dirname, 'payloads');

async function cleanupOldData() {
  await ProcessedMessage.deleteMany({});
  console.log('Old data cleaned up.');
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
  processPayloads();
}).catch(console.error);

async function processPayloads() {
  const files = fs.readdirSync(payloadDir).filter(f => f.endsWith('.json'));
  await cleanupOldData();

  for (const file of files) {
    console.log(`\n📦 Processing ${file}`);
    const raw = fs.readFileSync(path.join(payloadDir, file), 'utf-8');
    const data = JSON.parse(raw);

    if (data.metaData && data.metaData.entry) {
      for (const entry of data.metaData.entry) {
        for (const change of entry.changes) {
          const value = change.value;

          // ✅ Handle incoming messages
          if (value.messages && Array.isArray(value.messages)) {
            const contact = value.contacts?.[0]; // sender info
            const name = contact?.profile?.name || "Unknown";
            const wa_id = contact?.wa_id;

            for (const msg of value.messages) {
              const exists = await ProcessedMessage.findOne({ message_id: msg.id });
              if (exists) {
                console.log(`⚠️ Message ${msg.id} already exists. Skipping.`);
                continue;
              }

              const newMsg = new ProcessedMessage({
                wa_id,
                from: msg.from,
                to: value.metadata?.display_phone_number,
                text: msg.text?.body || '',
                type: msg.type,
                timestamp: new Date(parseInt(msg.timestamp) * 1000), // UNIX to Date
                message_id: msg.id,
                status: 'sent',
                name // ✅ Save name from contact
              });

              await newMsg.save();
              console.log(`✅ Saved message from ${name}: "${newMsg.text}"`);
            }
          }

          // ✅ Handle status updates
          if (value.statuses && Array.isArray(value.statuses)) {
            for (const statusObj of value.statuses) {
              const messageId = statusObj.id;
              const metaMsgId = statusObj.meta_msg_id;
              const status = statusObj.status;
              const statusTime = new Date(parseInt(statusObj.timestamp) * 1000);

              const result = await ProcessedMessage.findOneAndUpdate(
                {
                  $or: [
                    { message_id: messageId },
                    { meta_msg_id: metaMsgId }
                  ]
                },
                {
                  status: status,
                  timestamp: statusTime
                },
                { new: true }
              );

              if (result) {
                console.log(`🔄 Updated message ${messageId} with status '${status}'`);
              } else {
                console.log(`❌ Message not found for status update: ${messageId}`);
              }
            }
          }

        }
      }
    }
  }

  console.log('\n✅ All payloads processed.');
  mongoose.disconnect();
}
