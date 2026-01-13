
import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const styles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-indigo-600 text-white',
  };

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info',
  };

  return (
    <div className={`${styles[toast.type]} px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-full duration-300 min-w-[280px]`}>
      <i className={`fa-solid ${icons[toast.type]} text-xl`}></i>
      <span className="font-semibold">{toast.message}</span>
    </div>
  );
};

export default Toast;
