import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, type = 'info', duration = 3000 }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 9999,
        pointerEvents: 'none' // Let clicks pass through empty space
      }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <ToastItem 
              key={toast.id} 
              toast={toast} 
              onClose={() => removeToast(toast.id)} 
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const { title, description, type } = toast;
  
  const icons = {
    success: <Check size={18} color="var(--quantum-success)" />,
    info: <Info size={18} color="var(--quantum-gold)" />,
    error: <AlertTriangle size={18} color="var(--quantum-error)" />
  };

  const bgColors = {
    success: 'rgba(52, 211, 153, 0.1)',
    info: 'var(--quantum-gold-muted)',
    error: 'rgba(239, 68, 68, 0.1)'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      style={{
        pointerEvents: 'auto',
        background: 'var(--quantum-glass)',
        border: '1px solid var(--quantum-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '16px',
        minWidth: '300px',
        maxWidth: '400px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: bgColors[type],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {icons[type]}
      </div>

      <div style={{ flex: 1, paddingTop: '4px' }}>
        <h4 className="pp-ui-text" style={{ 
          margin: 0, 
          fontSize: '0.9rem', 
          fontWeight: 600, 
          color: 'var(--quantum-ivory)' 
        }}>
          {title}
        </h4>
        {description && (
          <p className="pp-ui-text" style={{ 
            margin: '4px 0 0', 
            fontSize: '0.85rem', 
            color: 'var(--quantum-text-muted)' 
          }}>
            {description}
          </p>
        )}
      </div>

      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--quantum-text-muted)',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex'
        }}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
