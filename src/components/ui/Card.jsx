import React from 'react';
import { cn } from '../../utils';

const Card = ({ className, children, ...props }) => {
  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-6 pb-4', className)} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-6 pt-2', className)} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-6 pt-4', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
export { CardHeader, CardContent, CardFooter };