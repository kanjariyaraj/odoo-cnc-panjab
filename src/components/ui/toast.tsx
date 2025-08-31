"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const ToastComponent = ({ id, type, title, message, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    info: 'text-blue-500',
    warning: 'text-yellow-500',
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={`max-w-sm w-full shadow-lg rounded-lg border ${colors[type]} pointer-events-auto`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColors[type]}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{title}</p>
            {message && (
              <p className="mt-1 text-sm opacity-90">{message}</p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              onClick={() => onClose(id)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

let toastCounter = 0;
const toastCallbacks: ((toasts: Toast[]) => void)[] = [];
let currentToasts: Toast[] = [];

const notifyToastListeners = () => {
  toastCallbacks.forEach(callback => callback([...currentToasts]));
};

export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    const id = `toast-${++toastCounter}`;
    const newToast: Toast = { id, type: 'success', title, message, duration };
    currentToasts.push(newToast);
    notifyToastListeners();
    return id;
  },
  error: (title: string, message?: string, duration?: number) => {
    const id = `toast-${++toastCounter}`;
    const newToast: Toast = { id, type: 'error', title, message, duration };
    currentToasts.push(newToast);
    notifyToastListeners();
    return id;
  },
  info: (title: string, message?: string, duration?: number) => {
    const id = `toast-${++toastCounter}`;
    const newToast: Toast = { id, type: 'info', title, message, duration };
    currentToasts.push(newToast);
    notifyToastListeners();
    return id;
  },
  warning: (title: string, message?: string, duration?: number) => {
    const id = `toast-${++toastCounter}`;
    const newToast: Toast = { id, type: 'warning', title, message, duration };
    currentToasts.push(newToast);
    notifyToastListeners();
    return id;
  },
  dismiss: (id: string) => {
    currentToasts = currentToasts.filter(toast => toast.id !== id);
    notifyToastListeners();
  },
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const callback = (newToasts: Toast[]) => {
      setToasts(newToasts);
    };

    toastCallbacks.push(callback);
    callback(currentToasts);

    return () => {
      const index = toastCallbacks.indexOf(callback);
      if (index > -1) {
        toastCallbacks.splice(index, 1);
      }
    };
  }, []);

  const handleClose = (id: string) => {
    toast.dismiss(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence>
          {toasts.map((toastItem) => (
            <ToastComponent
              key={toastItem.id}
              {...toastItem}
              onClose={handleClose}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ToastContainer;