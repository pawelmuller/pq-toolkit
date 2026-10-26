"use client";

import React, { useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Toast as ToastInterface, ToastType } from '@/lib/contexts/ToastContext';

interface ToastProps extends ToastInterface {
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000, onRemove }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onRemove]);

  const icons = {
    [ToastType.SUCCESS]: <FaCheckCircle className="w-5 h-5" />,
    [ToastType.ERROR]: <FaExclamationCircle className="w-5 h-5" />,
    [ToastType.INFO]: <FaInfoCircle className="w-5 h-5" />,
    [ToastType.WARNING]: <FaExclamationTriangle className="w-5 h-5" />
  };

  const styles = {
    [ToastType.SUCCESS]: 'bg-green-500 dark:bg-green-600',
    [ToastType.ERROR]: 'bg-red-500 dark:bg-red-600',
    [ToastType.INFO]: 'bg-blue-500 dark:bg-blue-600',
    [ToastType.WARNING]: 'bg-yellow-500 dark:bg-yellow-600'
  };

  return (
    <div
      className={`flex items-center p-4 mb-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${styles[type]}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-white">
        {icons[type]}
      </div>
      <div className="ml-3 text-sm font-normal text-white">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 text-white hover:text-gray-200 rounded-lg p-1.5 inline-flex h-8 w-8"
        onClick={() => onRemove(id)}
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  );
};

export default Toast; 