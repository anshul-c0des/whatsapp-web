import React from 'react';
import { CiLock } from "react-icons/ci";

const SelectChat = () => {
  return (
    <div className="flex flex-col items-center justify-around h-full bg-[#fffaf6] dark:bg-[#21272d]">
        <div className='flex flex-col items-center justify-center'> 
            <img src="/hero_img.png" alt="whatsapp" width={400} height={500} />
            <p className='text-4xl text-green-400 text-center mt-10'>Select a chat to start messaging</p>
        </div>
        <div className='flex gap-1 items-center justify-center'>
            <CiLock size={18} className='dark:text-gray-300'/>
            <p className='text-gray-500 text-sm mt-[2px] dark:text-300'>Your personal messages are end-to-end encrypted</p>
        </div>
    </div>
  )
}

export default SelectChat
