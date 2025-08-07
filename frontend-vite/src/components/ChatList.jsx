import React, { useEffect, useState } from 'react';
import moment from 'moment';


export default function ChatList({ chats, selectedWaId, onSelectChat }) {

  const [searchTerm, setSearchTerm] = useState('');
  
   // Filter chats by search
  const filteredChats = chats.filter(chat => {
    const searchLower = searchTerm.toLowerCase();
    const name = (chat.name || "").toLowerCase();
    const number = (chat.wa_id || "").toLowerCase();
    return name.includes(searchLower) || number.includes(searchLower);  
  })
  
  return (
    <div className="bg-white h-full divide-y">
      <div className="p-4 text-lg font-semibold border-b">
        <div>Chats</div>
        <input
            type="text"
            placeholder="Search chats"
            className="mt-2 p-2 border rounded"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            />
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
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{chat.name || chat.wa_id}</h3>
                <span className="text-sm text-gray-500">
                  {chat.lastMessage?.timestamp ? moment(chat.lastMessage.timestamp).fromNow() : ''}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {chat.lastMessage?.text || 'No message'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}