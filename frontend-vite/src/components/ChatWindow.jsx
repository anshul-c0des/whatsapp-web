import React, { useEffect, useState } from 'react';
import API from '../api.js';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';

export default function ChatWindow({ wa_id, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/api/chats/${wa_id}`);
    const { messages, user } = res.data;

    setMessages(messages || []);
    setUserInfo(user || null);  

    console.log('Fetched messages:', messages);
    console.log('Fetched user:', user); 
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    if (wa_id) fetchMessages();
  }, [wa_id]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const tempMessage = {
      message_id: 'temp_' + Date.now(),
      wa_id,
      from: '918329446654', // your own number
      to: wa_id,
      text,
      type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    // Show the new message immediately in UI
    setMessages((prev) => [...prev, tempMessage]);

    // Update chat list's last message preview immediately
    if (onNewMessage) onNewMessage(wa_id, tempMessage);

    try {
      await API.post('/api/messages', { wa_id, from: '918329446654', to: wa_id, text, type: 'text' });
      fetchMessages(); // re-fetch messages from backend to sync
    } catch (err) {
      console.error('Error sending message:', err);
      // Remove the temp message if sending fails
      setMessages((prev) => prev.filter((msg) => msg.message_id !== tempMessage.message_id));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white shadow">
        <h2 className="text-lg font-semibold">
          {userInfo?.name || wa_id}
        </h2>
        <p className="text-sm text-gray-500">{wa_id}</p>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-100 space-y-2">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.message_id || msg._id}
              message={msg}
              self={msg.from === '918329446654'} // assuming this is "you"
            />
          ))
        )}
      </div>

      {/* Input Box */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
