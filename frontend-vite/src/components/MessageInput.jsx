import React, { useState, useRef, useEffect } from 'react';
import { RiSendPlane2Fill } from 'react-icons/ri';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  const divRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');

    if (divRef.current) {
      divRef.current.innerText = '';
      divRef.current.style.height = '50px'; // Reset height to default
      divRef.current.classList.add('rounded-full'); // Reset border-radius
      divRef.current.classList.remove('rounded-xl');
    }
  };

  const handleChange = (e) => {
    setText(e.target.innerText);
  };

  useEffect(() => {
    if (divRef.current) {
      // Reset height to auto to calculate scrollHeight properly
      divRef.current.style.height = 'auto';
      // Set the height based on scrollHeight to dynamically adjust to the content
      divRef.current.style.height = `${divRef.current.scrollHeight}px`;

      // Apply rounded-lg when height grows above 72px, else keep it rounded-full
      if (divRef.current.scrollHeight > 62) {
        divRef.current.classList.remove('rounded-full'); // Remove full rounding
        divRef.current.classList.add('rounded-xl');      // Apply medium rounding
      } else {
        divRef.current.classList.remove('rounded-xl');  // Remove medium rounding
        divRef.current.classList.add('rounded-full');    // Apply full rounding
      }
    }
  }, [text]);

  // Ensure initial height is set properly when component mounts
  useEffect(() => {
    if (divRef.current) {
      divRef.current.style.height = '50px';
      divRef.current.classList.add('rounded-full');
    }
  }, []);
  useEffect(() => {
    const div = divRef.current;
    if (div && !text) {
      div.setAttribute('data-placeholder', 'Type a message');
    } else {
      div.removeAttribute('data-placeholder');
    }
  }, [text]);

  return (
    <form onSubmit={handleSubmit} className="relative p-3 bg-transparent flex">
      <div
        ref={divRef}
        contentEditable
        className="flex-1 border px-4 py-3 outline-none resize-none transition-all"
        placeholder="Type a message..."
        onInput={handleChange}
        style={{
          backgroundColor: 'white',
          overflow: 'hidden',
          minHeight: '40px', 
          maxHeight: '160px', 
          whiteSpace: 'pre-wrap',
          paddingRight: '45px',
          transition: 'border-radius 0.2s ease'
        }}
      />
      {text.trim() === '' && (
        <div
          className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400"
          style={{ pointerEvents: 'none' }}
        >
          Type a message
        </div>
      )}

      {text.trim() && (
        <button
          type="submit"
          className="absolute right-4 bottom-4 bg-whatsapp-light text-white px-2 py-2 rounded-full"
        >
          <RiSendPlane2Fill size={23} />
        </button>
      )}
    </form>
  );
}
