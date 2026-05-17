import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message) => addToast(message, 'success', 3000), [addToast]);
  const error = useCallback((message) => addToast(message, 'error', 4000), [addToast]);
  const info = useCallback((message) => addToast(message, 'info', 3000), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Toast Display Component
export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  const getToastConfig = (type) => {
    const configs = {
      success: {
        bgColor: 'bg-[#26bc71]/90',
        borderColor: 'border-[#26bc71]/30',
        icon: CheckCircle,
        iconColor: 'text-[#26bc71]',
        lightBg: 'bg-[#26bc71]/10',
      },
      error: {
        bgColor: 'bg-red-600/90',
        borderColor: 'border-red-500/30',
        icon: AlertCircle,
        iconColor: 'text-red-400',
        lightBg: 'bg-red-500/10',
      },
      info: {
        bgColor: 'bg-blue-600/90',
        borderColor: 'border-blue-500/30',
        icon: Info,
        iconColor: 'text-blue-400',
        lightBg: 'bg-blue-500/10',
      },
      warning: {
        bgColor: 'bg-yellow-600/90',
        borderColor: 'border-yellow-500/30',
        icon: AlertCircle,
        iconColor: 'text-yellow-400',
        lightBg: 'bg-yellow-500/10',
      },
    };
    return configs[type] || configs.info;
  };

  return (
    <div className="fixed top-8 right-8 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => {
        const config = getToastConfig(toast.type);
        const IconComponent = config.icon;

        return (
          <div
            key={toast.id}
            className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 shadow-2xl backdrop-blur-sm pointer-events-auto animate-in slide-in-from-top-4 fade-in duration-300 min-w-80 max-w-96`}
          >
            <div className="flex items-start gap-3">
              <div className={`${config.lightBg} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
                <IconComponent size={20} className={config.iconColor} />
              </div>
              <div className="flex-1 pt-0.5">
                <p className="text-white font-medium text-sm leading-relaxed">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/60 hover:text-white transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
