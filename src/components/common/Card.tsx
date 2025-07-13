import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  onClick,
  hover = false,
}) => {
  const hoverClasses = hover 
    ? 'transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]' 
    : '';
  
  const cursorClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-card ${hoverClasses} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className="px-6 pt-5 pb-3">
          {title && <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className={`px-6 py-4 ${!title && !subtitle ? 'pt-5' : ''}`}>
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;