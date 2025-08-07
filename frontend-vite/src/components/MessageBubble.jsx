import React from 'react';
import moment from 'moment';

export default function MessageBubble({ message, self }) {
  const bubbleClass = self
    ? 'bg-green-100 text-right ml-auto'
    : 'bg-white text-left mr-auto';

  const statusText = message.status?.toUpperCase?.() || 'SENT';
  
  const formattedDateTime = moment(message.timestamp).format('MMM D, YYYY, h:mm A');
  
  const renderStatus = (status) => {
    switch (status) {
      case 'sent':
        return <span className="text-gray-400">✓</span>;
      case 'delivered':
        return <span className="text-gray-400">✓✓</span>;
      case 'read':
        return <span className="text-blue-600">✓✓</span>;
      default:
        return <span className="text-gray-400">✓</span>;
    }
  };

  return (
    <div className={`max-w-xs rounded-lg p-2 shadow ${bubbleClass}`}>
      <p className="text-sm">{message.text}</p>
      <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
        <p className="text-xs text-gray-500">
          {formattedDateTime}
        </p>
        {self && <span className="ml-2 flex items-center">
            {renderStatus(message.status)}&nbsp;
            <span className="capitalize">{message.status || 'sent'}</span>
          </span>}
      </div>
    </div>
  );
}
