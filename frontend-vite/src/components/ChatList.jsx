import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { IoIosSearch } from "react-icons/io";
import { PiUserCircleDuotone } from 'react-icons/pi';

export default function ChatList({ chats, selectedWaId, onSelectChat }) {

  const [searchTerm, setSearchTerm] = useState('');
  
   // Filter chats by search
  const filteredChats = chats.filter(chat => {
    const searchLower = searchTerm.toLowerCase();
    const name = (chat.name || "").toLowerCase();
    const number = (chat.wa_id || "").toLowerCase();
    return name.includes(searchLower) || number.includes(searchLower);  
  })
  
  console.log(chats);
  
  return (
    <div className="bg-white h-full divide-y">
      <div className="bg-white p-4 text-lg font-semibold">
        <div className='text-whatsapp-light text-2xl'>WhatsApp</div>
        <div className='flex'>
          <IoIosSearch className='absolute left-6 mt-5' size={20} />
          <input
              type="text"
              placeholder="Search or start a new chat"
              className="mt-3 pl-8 p-2 border rounded w-full rounded-full text-sm placeholder:font-normal bg-gray-100"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-gray-500">No conversations found.</div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.wa_id}
              onClick={() => onSelectChat(chat.wa_id)}
              className={`cursor-pointer p-4 hover:bg-gray-100 transition ${
                selectedWaId === chat.wa_id ? 'bg-gray-200' : ''
              }`}
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-start">
                  <div className='flex -mt-1'>
                    <PiUserCircleDuotone className="text-gray-500 pr-1" size={50} />
                    <div className='mt-2'>
                      <h3 className="font-medium">{chat.name || chat.wa_id}</h3>  
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {chat.lastMessage?.timestamp ? moment(chat.lastMessage.timestamp).fromNow() : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate ml-12 -mt-6">
                  {chat.lastMessage?.text || 'No message'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}