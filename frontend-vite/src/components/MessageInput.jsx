import React, { useState } from 'react';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white flex">
      <input
        type="text"
        className="flex-1 border rounded-full px-4 py-2 outline-none"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        className="ml-2 bg-green-500 text-white px-4 py-2 rounded-full"
      >
        Send
      </button>
    </form>
  );
}
