import DarkModeToggle from './DarkModeToggle.jsx';

export default function Sidebar({className}) {
  return (
    <div className={`realative h-full w-16 bg-[#fffaf6] dark:bg-[#21272d] border-r border-gray-200 dark:border-gray-700 flex flex-col items-center justify-end py-4 space-y-4 ${className}`}>

      {/* Dark Mode Toggle */}
      <DarkModeToggle className='absolute bottom-4' />

    </div>
  );
}
