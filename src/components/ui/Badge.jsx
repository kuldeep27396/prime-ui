import React from 'react';
import { cn } from '../../utils';

const Badge = ({ 
  variant = 'default', 
  className, 
  children, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
  
  const variantClasses = {
    default: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-gray-50 text-gray-700 border-gray-200',
    outline: 'bg-transparent text-gray-700 border-gray-300',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200'
  };
  
  return (
    <span className={cn(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;