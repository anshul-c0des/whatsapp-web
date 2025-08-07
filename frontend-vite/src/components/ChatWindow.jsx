import React, { useEffect, useState } from 'react';
import API from '../api.js';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import { IoArrowBack } from "react-icons/io5";
import { PiUserCircleDuotone } from "react-icons/pi";

export default function ChatWindow({ wa_id, onNewMessage, onBack }) {
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await API.get(`/api/chats/${wa_id}`);
      const { messages, user } = res.data;

      setMessages(messages || []);
      setUserInfo(user || null);  
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    if (wa_id) fetchMessages();
  }, [wa_id]);

  // chatwindow.jsx
const handleSendMessage = async (text) => {
  if (!text.trim()) return;

  const tempMessage = {
    message_id: "temp_" + Date.now(),
    from: "918329446654",
    to: wa_id,
    text,
    timestamp: new Date().toISOString(),
    name: userInfo?.name || wa_id
  };

  setMessages((prev) => [...prev, tempMessage]);
  if (onNewMessage) onNewMessage(wa_id, tempMessage);

  try {
    await API.post('/api/messages', {
      wa_id,
      from: '918329446654',
      to: wa_id,
      text,
      type: 'text',
      // Pass the name to the backend
      name: userInfo?.name 
    });
    fetchMessages(); // re-fetch messages from backend to sync
  } catch (err) {
    console.error('Error sending message:', err);
    setMessages((prev) => prev.filter((msg) => msg.message_id !== tempMessage.message_id));
  }
};

  return (
    <div
      className="flex flex-col h-full"
      style={{
        backgroundImage: 'url(/chat_bg.webp)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
      }}
    >
      <div className="md:hidden bg-white p-4 border-b flex items-center">
        <button onClick={onBack} className="text-green-600 "><IoArrowBack size={30} /></button>
        <div className='flex'>
        <PiUserCircleDuotone size={45} className='mr-2' />
        <div className="text-right">
          <h2 className="text-md font-semibold">{userInfo?.name || wa_id}</h2>
          <p className="text-sm text-gray-500">{wa_id}</p>
        </div>
        </div>
      </div>

      {/* Header */}
      <div className="hidden p-3 border-b bg-white shadow-md md:flex">
      <PiUserCircleDuotone size={45} className='mr-2' />
      <div>
        <h2 className="text-md font-bold">
          {userInfo?.name || wa_id}
        </h2>
        <p className="text-sm text-gray-500">{wa_id}</p>
      </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
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
