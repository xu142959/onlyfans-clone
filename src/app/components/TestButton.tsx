import { useState } from 'react';

export function TestButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    console.log('Button clicked, isOpen:', !isOpen);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="relative flex items-center justify-center w-10 h-10 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full">
          3
        </span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg">
          <div className="p-4 border-b border-zinc-800">
            <h3 className="font-semibold">通知</h3>
          </div>
          <div className="p-4">
            <p>测试通知内容</p>
          </div>
        </div>
      )}
    </div>
  );
}
