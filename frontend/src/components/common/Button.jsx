// src/components/ui/Button.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  to, 
  onClick, 
  type = 'primary', 
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'right',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}, ref) => {
  
  // Base class
  const baseClass = `btn btn-${type} btn-${size} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''} ${className}`;

  // Content with icon
  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      <span className="btn-text">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
      {loading && <span className="btn-spinner"></span>}
    </>
  );

  // Animation variants
  const animationProps = !disabled && !loading ? {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 17 }
  } : {};

  // Agar link hai to
  if (to) {
    return (
      <motion.div
        {...animationProps}
        style={{ display: 'inline-block' }}
        ref={ref}
      >
        <Link 
          to={to} 
          className={baseClass} 
          {...props}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  // Agar button hai to
  return (
    <motion.div
      {...animationProps}
      style={{ display: 'inline-block' }}
      ref={ref}
    >
      <button 
        className={baseClass} 
        onClick={onClick} 
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    </motion.div>
  );
});

Button.displayName = 'Button';

// Default export
export default Button;

// ============= BUTTON STYLES - NEWPREM THEME =============
export const buttonStyles = `
  /* Base Button Styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    border-radius: 40px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    border: none;
    font-family: 'Jost', sans-serif;
    line-height: 1;
    letter-spacing: 0.02em;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .btn:focus-visible {
    outline: 2px solid var(--gold, #c9a96e);
    outline-offset: 2px;
  }

  /* ===== BUTTON TYPES - NEWPREM THEME ===== */
  
  /* Primary Button - Gold Gradient */
  .btn-primary {
    background: linear-gradient(135deg, #c9a96e 0%, #a07840 100%);
    color: #111111;
    box-shadow: 0 10px 20px -8px rgba(201, 169, 110, 0.3);
  }

  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #111111;
    transform: translateX(-101%);
    transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    z-index: 0;
  }

  .btn-primary:hover:not(:disabled)::before {
    transform: translateX(0);
  }

  .btn-primary:hover:not(:disabled) {
    color: #c9a96e;
    transform: translateY(-3px);
    box-shadow: 0 20px 30px -10px rgba(201, 169, 110, 0.4);
  }

  .btn-primary .btn-text,
  .btn-primary .btn-icon {
    position: relative;
    z-index: 1;
    transition: color 0.3s ease;
  }

  /* Secondary Button - Outline Gold */
  .btn-secondary {
    background: transparent;
    color: #c9a96e;
    border: 2px solid #c9a96e;
    box-shadow: none;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #c9a96e;
    color: #111111;
    transform: translateY(-3px);
    box-shadow: 0 15px 25px -8px rgba(201, 169, 110, 0.3);
  }

  /* Outline Button - White/Gold */
  .btn-outline {
    background: transparent;
    color: #ffffff;
    border: 2px solid rgba(255,255,255,0.3);
    box-shadow: none;
  }

  .btn-outline:hover:not(:disabled) {
    border-color: #c9a96e;
    color: #c9a96e;
    transform: translateY(-3px);
    background: rgba(0,0,0,0.2);
  }

  /* Dark Outline Button - For light backgrounds */
  .btn-outline-dark {
    background: transparent;
    color: #111111;
    border: 2px solid #c9a96e;
    box-shadow: none;
  }

  .btn-outline-dark:hover:not(:disabled) {
    background: #c9a96e;
    color: #111111;
    transform: translateY(-3px);
    box-shadow: 0 15px 25px -8px rgba(201, 169, 110, 0.3);
  }

  /* Ghost Button - No background, just text */
  .btn-ghost {
    background: transparent;
    color: #ffffff;
    border: none;
    border-bottom: 2px solid rgba(255,255,255,0.3);
    border-radius: 0;
    padding: 0.5rem 0;
    box-shadow: none;
  }

  .btn-ghost:hover:not(:disabled) {
    color: #c9a96e;
    border-color: #c9a96e;
    transform: translateY(-2px);
  }

  /* Glass Button - For modern sections */
  .btn-glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: #ffffff;
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 8px 20px rgba(0,0,0,0.2);
  }

  .btn-glass:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
    border-color: #c9a96e;
  }

  /* Danger Button - Red */
  .btn-danger {
    background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
    color: white;
    box-shadow: 0 10px 20px -8px rgba(239, 68, 68, 0.3);
  }

  .btn-danger:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 20px 30px -10px rgba(239, 68, 68, 0.4);
  }

  /* Success Button - Green */
  .btn-success {
    background: linear-gradient(135deg, #10b981 0%, #047857 100%);
    color: white;
    box-shadow: 0 10px 20px -8px rgba(16, 185, 129, 0.3);
  }

  .btn-success:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 20px 30px -10px rgba(16, 185, 129, 0.4);
  }

  /* Warning Button - Orange */
  .btn-warning {
    background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%);
    color: white;
    box-shadow: 0 10px 20px -8px rgba(245, 158, 11, 0.3);
  }

  .btn-warning:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 20px 30px -10px rgba(245, 158, 11, 0.4);
  }

  /* Info Button - Blue */
  .btn-info {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    box-shadow: 0 10px 20px -8px rgba(59, 130, 246, 0.3);
  }

  .btn-info:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 20px 30px -10px rgba(59, 130, 246, 0.4);
  }

  /* ===== BUTTON SIZES ===== */
  
  /* Extra Small */
  .btn-xs {
    padding: 0.4rem 1.2rem;
    font-size: 0.75rem;
    gap: 0.4rem;
  }

  .btn-xs .btn-icon {
    font-size: 0.9rem;
  }

  /* Small */
  .btn-sm {
    padding: 0.6rem 1.8rem;
    font-size: 0.85rem;
    gap: 0.5rem;
  }

  .btn-sm .btn-icon {
    font-size: 1rem;
  }

  /* Medium (Default) */
  .btn-md {
    padding: 0.8rem 2.2rem;
    font-size: 0.95rem;
    gap: 0.6rem;
  }

  .btn-md .btn-icon {
    font-size: 1.1rem;
  }

  /* Large */
  .btn-lg {
    padding: 1rem 2.8rem;
    font-size: 1.1rem;
    gap: 0.8rem;
  }

  .btn-lg .btn-icon {
    font-size: 1.3rem;
  }

  /* Extra Large */
  .btn-xl {
    padding: 1.2rem 3.2rem;
    font-size: 1.2rem;
    gap: 1rem;
  }

  .btn-xl .btn-icon {
    font-size: 1.5rem;
  }

  /* ===== FULL WIDTH ===== */
  .btn-full {
    width: 100%;
  }

  /* ===== ICON POSITIONING ===== */
  .btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s ease;
  }

  .btn-icon-left {
    margin-right: -0.2rem;
  }

  .btn-icon-right {
    margin-left: -0.2rem;
  }

  .btn:hover:not(:disabled) .btn-icon-right {
    transform: translateX(4px) scale(1.1);
  }

  .btn:hover:not(:disabled) .btn-icon-left {
    transform: translateX(-4px) scale(1.1);
  }

  /* Special for phone icon */
  .btn .btn-icon svg[data-icon="phone"],
  .btn .btn-icon .fa-phone,
  .btn .btn-icon svg[class*="Phone"] {
    transform: rotate(90deg);
    transition: transform 0.3s ease;
  }

  .btn:hover:not(:disabled) .btn-icon svg[data-icon="phone"],
  .btn:hover:not(:disabled) .btn-icon .fa-phone,
  .btn:hover:not(:disabled) .btn-icon svg[class*="Phone"] {
    transform: rotate(90deg) scale(1.1);
  }

  /* ===== LOADING STATE ===== */
  .btn-loading {
    position: relative;
    color: transparent !important;
    pointer-events: none;
  }

  .btn-spinner {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 50%;
    left: 50%;
    margin-left: -10px;
    margin-top: -10px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: currentColor;
    border-radius: 50%;
    animation: btn-spin 0.8s linear infinite;
  }

  @keyframes btn-spin {
    to { transform: rotate(360deg); }
  }

  /* ===== BUTTON GROUP ===== */
  .btn-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: center;
  }

  .btn-group-vertical {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    align-items: stretch;
  }

  /* ===== BUTTON WITH BADGE ===== */
  .btn-badge {
    position: relative;
  }

  .btn-badge-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ef4444;
    color: white;
    font-size: 0.7rem;
    font-weight: 600;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border: 2px solid white;
  }

  /* ===== RESPONSIVE STYLES ===== */
  @media (max-width: 1024px) {
    .btn-lg {
      padding: 0.9rem 2.4rem;
      font-size: 1rem;
    }
    
    .btn-xl {
      padding: 1rem 2.8rem;
      font-size: 1.1rem;
    }
  }

  @media (max-width: 768px) {
    .btn-xs {
      padding: 0.3rem 1rem;
      font-size: 0.7rem;
    }

    .btn-sm {
      padding: 0.5rem 1.5rem;
      font-size: 0.8rem;
    }

    .btn-md {
      padding: 0.7rem 2rem;
      font-size: 0.9rem;
    }

    .btn-lg {
      padding: 0.8rem 2.2rem;
      font-size: 0.95rem;
    }

    .btn-xl {
      padding: 0.9rem 2.5rem;
      font-size: 1rem;
    }

    .btn-group {
      gap: 0.8rem;
    }
  }

  @media (max-width: 480px) {
    .btn-xs {
      padding: 0.25rem 0.8rem;
      font-size: 0.65rem;
    }

    .btn-sm {
      padding: 0.4rem 1.2rem;
      font-size: 0.75rem;
    }

    .btn-md {
      padding: 0.6rem 1.8rem;
      font-size: 0.85rem;
    }

    .btn-lg {
      padding: 0.7rem 2rem;
      font-size: 0.9rem;
    }

    .btn-xl {
      padding: 0.8rem 2.2rem;
      font-size: 0.95rem;
    }
  }

  /* ===== DARK MODE SUPPORT ===== */
  @media (prefers-color-scheme: dark) {
    .btn-outline-dark {
      border-color: #c9a96e;
      color: #c9a96e;
    }
    
    .btn-outline-dark:hover:not(:disabled) {
      background: #c9a96e;
      color: #111111;
    }
  }

  /* ===== PRINT STYLES ===== */
  @media print {
    .btn {
      display: none;
    }
  }
`;

// Add styles to document if not already present
if (typeof document !== 'undefined' && !document.querySelector('#button-styles')) {
  const style = document.createElement('style');
  style.id = 'button-styles';
  style.textContent = buttonStyles;
  document.head.appendChild(style);
}