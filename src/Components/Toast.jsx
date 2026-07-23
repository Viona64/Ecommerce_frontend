import React, { useEffect } from 'react';

export function Toast({ id, message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    if (type === 'success') return 'bi-check-circle-fill text-emerald-500';
    if (type === 'error') return 'bi-exclamation-circle-fill text-rose-500';
    return 'bi-info-circle-fill text-indigo-500';
  };

  return (
    <div className="custom-toast flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <i className={`bi ${getIcon()} text-lg`}></i>
        <span className="text-xs font-bold text-slate-800">{message}</span>
      </div>
      <button 
        onClick={() => onClose(id)} 
        className="ms-4 p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors border-0 bg-transparent cursor-pointer flex items-center justify-center"
      >
        <i className="bi bi-x-lg text-[10px]"></i>
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast 
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={removeToast}
        />
      ))}
    </div>
  );
}
