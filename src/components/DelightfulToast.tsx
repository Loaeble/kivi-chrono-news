import { useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
  emoji?: string;
  onClose: () => void;
}

export const DelightfulToast = ({ message, type, emoji, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'error':
        return <X className="h-5 w-5" />;
    }
  };

  const getVariantClass = () => {
    switch (type) {
      case 'success':
        return 'border-success/20 bg-gradient-success text-success-foreground shadow-success';
      case 'warning':
        return 'border-warning/20 bg-gradient-warning text-warning-foreground shadow-warning';
      case 'info':
        return 'border-info/20 bg-gradient-info text-info-foreground shadow-info';
      case 'error':
        return 'border-destructive/20 bg-destructive text-destructive-foreground shadow-lg';
    }
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center gap-3 rounded-2xl border p-4 transition-all duration-300 backdrop-blur-md',
        getVariantClass(),
        isVisible ? 'animate-scale-in opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      )}
    >
      {emoji && <span className="text-lg">{emoji}</span>}
      {getIcon()}
      <span className="font-medium">{message}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClose}
        className="h-6 w-6 p-0 ml-2 hover:bg-white/20 rounded-full"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

interface UseToastReturn {
  showToast: (message: string, type: 'success' | 'warning' | 'info' | 'error', emoji?: string) => void;
  ToastContainer: () => JSX.Element | null;
}

export const useDelightfulToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: 'success' | 'warning' | 'info' | 'error'; emoji?: string }>>([]);
  const [nextId, setNextId] = useState(0);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error', emoji?: string) => {
    const id = nextId;
    setNextId(prev => prev + 1);
    setToasts(prev => [...prev, { id, message, type, emoji }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => {
    if (toasts.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <DelightfulToast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            emoji={toast.emoji}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    );
  };

  return { showToast, ToastContainer };
};