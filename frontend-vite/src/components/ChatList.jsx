import React, { useEffect, useState } from 'react';
import moment from 'moment';

// ChatList.jsx

export default function ChatList({ chats, selectedWaId, onSelectChat }) {

  return (
    <div className="bg-white h-full divide-y">
      <div className="p-4 text-lg font-semibold border-b">Chats</div>
      {/* If no chats are found */}
      {chats.length === 0 && (
        <div className="p-4 text-gray-500">No conversations found.</div>
      )}

      {/* Render each chat */}
      {chats.map((chat) => (
        <div
          key={chat.wa_id}
          onClick={() => onSelectChat(chat.wa_id)}
          className={`cursor-pointer p-4 hover:bg-gray-100 transition ${
            selectedWaId === chat.wa_id ? 'bg-gray-200' : ''
          }`}
        >
          <div className="flex justify-between items-center">
            {/* Display the name or fallback to the wa_id if no name exists */}
            <h3 className="font-medium">{chat.name || chat.wa_id}</h3>
            <span className="text-sm text-gray-500">
              {/* Format the timestamp to show time from now */}
              {chat.lastMessage?.timestamp ? moment(chat.lastMessage.timestamp).fromNow() : ''}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate">
            {/* Show last message text or a fallback if no message */}
            {chat.lastMessage?.text || 'No message'}
          </p>
        </div>
      ))}
    </div>
  );
}
