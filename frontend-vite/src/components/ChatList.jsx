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
    <div className="bg-white h-full dark:bg-[#0b141a] dark:text-white">
      <div className="relative bg-white p-4 text-lg font-semibold dark:bg-[#0b141a]">
        <div className='ml-1.5 mt-0.5 text-[#30b360] text-xl font-bold  dark:text-white'>WhatsApp</div>
        <div className='flex mt-2'>
          <IoIosSearch className='absolute left-9 mt-5 dark:text-gray-300' size={18} />
          <input
              type="text"
              placeholder="Search or start a new chat"
              className="mt-2.5 mx-1 pl-12 p-2.5 w-full rounded-full text-sm placeholder:font-normal bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#30b360] dark:bg-[#252a30] dark:focus:bg-[#0b141a]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mt-2">
        {filteredChats.length === 0 ? (
          <div className="p-4 text-gray-500">No conversations found.</div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.wa_id}
              onClick={() => onSelectChat(chat.wa_id)}
              className={`cursor-pointer p-4 transition my-1 mx-3 rounded-md
                hover:bg-[#f1f0f0] dark:hover:bg-gray-700
                ${selectedWaId === chat.wa_id
                  ? 'bg-[#f5f3f3] dark:bg-gray-800'
                  : ''}`} 
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-start">
                  <div className='flex -mt-1'>
                    <PiUserCircleDuotone className="text-gray-500 pr-1" size={50} />
                    <div className='mt-2'>
                      <h3 className="font-medium">{chat.name || chat.wa_id}</h3>  
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-200">
                    {chat.lastMessage?.timestamp ? moment(chat.lastMessage.timestamp).fromNow() : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate ml-12 -mt-6 dark:text-gray-400">
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