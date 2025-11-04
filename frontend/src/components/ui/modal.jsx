import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* background blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* modal box */}
      <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        {children}
      </div>
    </div>
  );
}
