import React from 'react';
import { cn } from '@/utils/cn';
import { getStatusColor } from '@/utils/format';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'pending' | 'verified' | 'approved' | 'rejected' | 'default';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  children, 
  className, 
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border';
  
  const getVariantClasses = () => {
    if (variant === 'default') {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
    return getStatusColor(variant);
  };

  return (
    <span
      className={cn(baseClasses, getVariantClasses(), className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge; 