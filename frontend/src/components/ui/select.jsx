// components > ui > select.jsx

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Basic Select wrapper (not needed for this dropdown version, kept for backward compatibility)
export const Select = ({ children, ...props }) => (
  <select
    className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    {...props}
  >
    {children}
  </select>
);

// Trigger button for custom dropdown
export const SelectTrigger = ({ children, onClick, className = "", isOpen }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 border rounded-md bg-white flex justify-between items-center gap-2 ${className}`}
  >
    {children}
    <ChevronDown className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
  </button>
);

// Display selected value
export const SelectValue = ({ children }) => <span>{children}</span>;

// Dropdown content container
export const SelectContent = ({ children, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div
      className="mt-1 border rounded-md bg-white absolute left-0 z-10 shadow-md"
      onClick={(e) => e.stopPropagation()} // prevents closing when clicking inside
    >
      {children}
    </div>
  );
};

// Dropdown item
export const SelectItem = ({ value, children, onSelect }) => (
  <div
    data-value={value}
    className="px-3 py-1 hover:bg-slate-100 cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      onSelect(value);
    }}
  >
    {children}
  </div>
);

// Hook to handle click outside to close dropdown
export const useDropdown = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = () => setIsOpen((prev) => !prev);

  return { isOpen, toggle, ref, setIsOpen };
};