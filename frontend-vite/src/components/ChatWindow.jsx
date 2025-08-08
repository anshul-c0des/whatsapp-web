import React, { useEffect, useState } from 'react';
import API from '../api.js';
import MessageBubble from './MessageBubble.jsx';
import MessageInput from './MessageInput.jsx';
import { IoArrowBack } from "react-icons/io5";
import { PiUserCircleDuotone } from "react-icons/pi";
import moment from 'moment';
import DarkModeToggle from './DarkModeToggle.jsx';
import { MoonLoader } from 'react-spinners'; 

export default function ChatWindow({ wa_id, onNewMessage, onBack }) {
  const [messages, setMessages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false); 

  const fetchMessages = async () => {
    try {
      setLoading(true); 
      const res = await API.get(`/api/chats/${wa_id}`);
      const { messages, user } = res.data;

      setMessages(messages || []);
      setUserInfo(user || null);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (wa_id) fetchMessages();
  }, [wa_id]);

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
        name: userInfo?.name 
      });
      fetchMessages(); // re-fetch messages from backend to sync
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => prev.filter((msg) => msg.message_id !== tempMessage.message_id));
    }
  };

  const formatDay = (timestamp) => {
    const now = moment();
    const date = moment(timestamp);

    if (now.isSame(date, 'day')) return 'Today';
    if (now.clone().subtract(1, 'day').isSame(date, 'day')) return 'Yesterday';
    return date.format('D/M/YYYY');
  };

  return (
    <div
      className={`
        flex flex-col h-full
        bg-[url('/chat_bg.webp')]
        dark:bg-[url('/dark_bg.jpg')]
        bg-cover bg-center
      `}
    >
      {/* Mobile */}
      <div className="md:hidden bg-white p-4 flex items-center dark:bg-[#0b141a] dark:text-white">
        <div className="flex items-center justify-between p-2 w-full">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-green-600">
              <IoArrowBack size={30} />
            </button>
            <div className="flex items-center">
              <PiUserCircleDuotone size={45} className="mr-2" />
              <div>
                <h2 className="text-md font-semibold">{userInfo?.name || wa_id}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">{wa_id}</p>
              </div>
            </div>
          </div>
          <DarkModeToggle />
        </div>
      </div>

      {/* Header */}
      <div className="hidden p-3 bg-white shadow-md md:flex dark:bg-[#0b141a] dark:text-white">
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
        {loading ? (
          <div className="flex justify-center items-center h-full p-10 bg-white dark:bg-[#0b141a]">
            <MoonLoader color="#22c55e" size={50} />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          (() => {
            let lastDate = null;

            return messages.map((msg) => {
              const msgDate = moment(msg.timestamp).format('YYYY-MM-DD');
              const showDateBadge = msgDate !== lastDate;
              lastDate = msgDate;

              return (
                <React.Fragment key={msg.message_id || msg._id}>
                  {showDateBadge && (
                    <div className="flex justify-center my-4">
                      <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-md shadow-sm dark:bg-gray-900 dark:text-gray-400">
                        {formatDay(msg.timestamp)}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    self={msg.from === '918329446654'}
                  />
                </React.Fragment>
              );
            });
          })()
        )}
      </div>

      {/* Input Box */}
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}
