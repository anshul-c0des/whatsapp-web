import React, { useEffect, useState } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useParams, useNavigate } from 'react-router-dom';

export default function Home() {
  const { wa_id } = useParams();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
    
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats`)
      .then(res => res.json())
      .then(data => setChats(data));
  }, []);

  useEffect(() => {
    setActiveChat(wa_id || null);
  }, [wa_id]);

  // Update chat list's last message after sending new message
const updateLastMessage = (wa_id, newMessage) => {
  setChats(prevChats => {
    // 1. Find the chat that was just updated
    const chatIndex = prevChats.findIndex(chat => chat.wa_id === wa_id);

    // 2. Prepare the new last message data
    const newLastMessage = {
      text: newMessage.text,
      timestamp: newMessage.timestamp,
      status: newMessage.status || 'sent',
    };

    let updatedChats;
    if (chatIndex !== -1) {
      // 3. If chat exists, update its last message and move it to the top
      const updatedChat = {
        ...prevChats[chatIndex],
        lastMessage: newLastMessage
      };
      const otherChats = prevChats.filter(chat => chat.wa_id !== wa_id);
      updatedChats = [updatedChat, ...otherChats];
    } else {
      // 4. If it's a new chat, create it and add it to the top
      const newChat = {
        wa_id,
        name: newMessage.name || wa_id,
        lastMessage: newLastMessage
      };
      updatedChats = [newChat, ...prevChats];
    }
    return updatedChats;
  });
};

  // Handle chat selection from chatlist
  const handleSelectChat = (wa_id) => {
    setActiveChat(wa_id);
    navigate(`/chat/${wa_id}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`w-full md:w-1/3 border-r overflow-y-auto ${activeChat ? 'hidden md:block' : 'block'}`}>
        <ChatList chats={chats} selectedWaId={activeChat} onSelectChat={handleSelectChat} />
      </div>
      <div className={`w-full md:flex-1 ${activeChat ? 'block' : 'hidden md:block'}`}>
        {activeChat ? (
          <ChatWindow
            wa_id={activeChat}
            onNewMessage={updateLastMessage}
            onBack={() => navigate('/')}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}