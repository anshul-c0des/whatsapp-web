import React from 'react';
import moment from 'moment';
import { BiCheckDouble } from "react-icons/bi";
import { TiTick } from "react-icons/ti";

export default function MessageBubble({ message, self }) {
  const bubbleClass = self
    ? 'bg-[#DCF8C6] text-right ml-auto'
    : 'bg-white text-left mr-auto';
  
  const formattedDateTime = moment(message.timestamp).format('h:mm A');
  
  const renderStatus = (status) => {
    switch (status) {
      case 'sent':
        return <TiTick  size={23} className="text-gray-400" />
      case 'delivered':
        return <BiCheckDouble size={23} className="text-gray-400" />
      case 'read':
        return <BiCheckDouble size={23} className="text-blue-600" />
      default:
        return <TiTick  size={23} className="text-gray-400" />;
    }
  };

  return (
    <div className={`max-w-xs rounded-lg p-2 shadow ${bubbleClass}`}>
      <p className="text-sm">{message.text}</p>
      <div className="text-xs text-gray-500 mt-1 flex justify-end items-center">
        <p className="text-xs text-gray-500">
          {formattedDateTime}
        </p>
        {self && <span className="ml-2 flex items-center">
            {renderStatus(message.status)}&nbsp;
          </span>}
      </div>
    </div>
  );
}
