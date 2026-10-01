import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';

export default function Toast({ message, type = 'error', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 px-4 py-3 min-w-[320px] max-w-[400px] rounded-2xl shadow-2xl border transition-all bg-white dark:bg-[#18181d] text-neutral-900 dark:text-white border-neutral-200 dark:border-neutral-800">
      <div className={`p-1.5 rounded-xl flex-shrink-0 mt-0.5 ${isSuccess ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
        {isSuccess ? <FiCheckCircle className="w-4 h-4" /> : <FiAlertCircle className="w-4 h-4" />}
      </div>
      <div className="flex-1 pr-1">
        <p className="text-xs font-bold leading-none mb-1">{isSuccess ? 'Success' : 'Error'}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white transition-colors cursor-pointer flex-shrink-0"
      >
        <FiX className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
