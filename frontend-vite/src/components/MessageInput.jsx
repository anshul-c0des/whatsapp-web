import React, { useState, useRef, useEffect } from 'react';
import { RiSendPlane2Fill } from 'react-icons/ri';
import { PiStickerBold } from "react-icons/pi";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');   // actual input text
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);   // emoji picker state
  const divRef = useRef(null);   // ref to contentEditable div

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
    if (divRef.current) {
      divRef.current.innerText = '';
      divRef.current.style.height = '50px';
      divRef.current.classList.add('rounded-full');
      divRef.current.classList.remove('rounded-xl');
    }
  };

  const handleChange = () => {  // Updates text state every time user types 
    setText(divRef.current.innerText);
  };

  const handleEmojiSelect = (emoji) => {  // inserts emoji in the contentEditable div
    const emojiChar = emoji.native;
    const div = divRef.current;
    const selection = window.getSelection();

    if (div && selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const emojiNode = document.createTextNode(emojiChar);
      range.insertNode(emojiNode);

      range.setStartAfter(emojiNode);
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);

      setText(div.innerText);
      div.focus();
    }
  };

  useEffect(() => {
    if (divRef.current) { 
      divRef.current.style.height = 'auto';    // Adjusts height to fit content
      divRef.current.style.height = `${divRef.current.scrollHeight}px`;

      if (divRef.current.scrollHeight > 62) {    // Changes border radius depending on height
        divRef.current.classList.remove('rounded-full');
        divRef.current.classList.add('rounded-xl');
      } else {
        divRef.current.classList.remove('rounded-xl');
        divRef.current.classList.add('rounded-full');
      }
    }
  }, [text]);

  useEffect(() => {    // reset height and roundness on component mount
    if (divRef.current) {
      divRef.current.style.height = '50px';
      divRef.current.classList.add('rounded-full');
    }
  }, []);

  useEffect(() => {    // adds a placeholder text
    const div = divRef.current;
    if (div && !text) {
      div.setAttribute('data-placeholder', 'Type a message');
    } else {
      div.removeAttribute('data-placeholder');
    }
  }, [text]);

  return (
    <form onSubmit={handleSubmit} className="relative p-3 bg-transparent flex items-end">
      <div className="relative flex-1">

        {/* Text Area */}
        <div
          ref={divRef}
          contentEditable
          onInput={handleChange}
          className="w-full bg-white px-11 pr-14 py-3 outline-none resize-none transition-all dark:bg-[#252a30] dark:text-white"
          style={{
            overflow: 'hidden',
            minHeight: '40px',
            maxHeight: '160px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            transition: 'border-radius 0.2s ease',
          }}
        ></div>

        {/* Placeholder */}
        {!text.trim() && (
          <div className="absolute left-11 top-3 text-gray-400 pointer-events-none">
            Type a message
          </div>
        )}

        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute left-2.5 bottom-3 font-bold text-gray-500 hover:text-green-600 dark:text-gray-200"
        >
          <PiStickerBold size={27} />
        </button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-14 left-0 z-50">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
          </div>
        )}

        {/* Send Button */}
        {text.trim() && (
          <button
            type="submit"
            className="absolute right-2 bottom-1.5 bg-whatsapp-light text-white p-2 rounded-full hover:bg-[#33dc71] dark:bg-[#46cd41] dark:hover:bg-[#33a130] dark:text-black"
          >
            <RiSendPlane2Fill size={22} />
          </button>
        )}
      </div>
    </form>
  );
}
