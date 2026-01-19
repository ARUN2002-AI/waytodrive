import { useState, useRef, useEffect } from 'react';
import { statusOptions } from '../data/mockData';

function StatusDropdown({ currentStatus, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentOption = statusOptions.find(opt => opt.value === currentStatus) || statusOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (status) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 rounded-lg font-medium min-w-[120px] flex items-center justify-between gap-2 ${currentOption.color}`}
      >
        <span>{currentOption.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-purple-900 border border-white/20 rounded-lg shadow-lg z-10 overflow-hidden">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full px-4 py-2 text-left hover:opacity-90 transition-opacity ${option.color} ${
                option.value === currentStatus ? 'opacity-70' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatusDropdown;
