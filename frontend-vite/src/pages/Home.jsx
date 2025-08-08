import React, { useEffect, useState } from 'react';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useParams, useNavigate } from 'react-router-dom';
import SelectChat from '../components/SelectChat';
import Sidebar from '../components/Sidebar';
import API from '../api';
import { MoonLoader } from 'react-spinners';

export default function Home() {
  const { wa_id } = useParams();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [hasRefreshed, setHasRefreshed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get('/api/chats')
      .then(response => {
        setChats(response.data);
      })
      .catch(error => {
        console.error("Error fetching chats:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (hasRefreshed) {
      setActiveChat(null);
      setHasRefreshed(false);
    } else {
      setActiveChat(wa_id || null);
    }
  }, [wa_id]);

  const updateLastMessage = (wa_id, newMessage) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(chat => chat.wa_id === wa_id);
      const newLastMessage = {
        text: newMessage.text,
        timestamp: newMessage.timestamp,
        status: newMessage.status || 'sent',
      };

      let updatedChats;
      if (chatIndex !== -1) {
        const updatedChat = {
          ...prevChats[chatIndex],
          lastMessage: newLastMessage
        };
        const otherChats = prevChats.filter(chat => chat.wa_id !== wa_id);
        updatedChats = [updatedChat, ...otherChats];
      } else {
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

  const handleSelectChat = (wa_id) => {
    setActiveChat(wa_id);
    navigate(`/chat/${wa_id}`);
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100 font-sans">
        <Sidebar className="hidden md:block" />
        <div className={`w-full md:w-[40%] border-r dark:border-gray-700 overflow-y-auto ${activeChat ? 'hidden md:block' : 'block'}`}>
          {loading ? (
            <div className="flex justify-center items-center h-full p-10">
              <MoonLoader color="#22c55e" size={50} />
            </div>
          ) : (
            <ChatList chats={chats} selectedWaId={activeChat} onSelectChat={handleSelectChat} />
          )}
        </div>
        <div className={`w-full md:flex-1 ${activeChat ? 'block' : 'hidden md:block'}`}>
          {activeChat ? (
            <ChatWindow
              wa_id={activeChat}
              onNewMessage={updateLastMessage}
              onBack={() => navigate('/')}
            />
          ) : (
            <SelectChat />
          )}
        </div>
      </div>
    </>
  );
}
