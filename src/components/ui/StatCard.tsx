import React from 'react';
import { cn } from '@/utils/cn';
import { formatCurrency, formatNumber } from '@/utils/format';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  className?: string;
  formatType?: 'currency' | 'number' | 'none';
  iconBgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  className,
  formatType = 'none',
  iconBgColor = 'bg-primary-500'
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (formatType) {
      case 'currency':
        return formatCurrency(val);
      case 'number':
        return formatNumber(val);
      default:
        return val.toLocaleString();
    }
  };

  return (
    <div className={cn(
      'bg-white rounded-xl p-6 shadow-card border border-gray-200 hover:shadow-lg transition-shadow',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {formatValue(value)}
          </p>
        </div>
        <div className={cn(
          'flex items-center justify-center w-12 h-12 rounded-lg text-white',
          iconBgColor
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard; 