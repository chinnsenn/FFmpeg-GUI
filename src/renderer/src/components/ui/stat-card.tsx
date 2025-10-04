import { Card } from './card';
import { cn } from '@renderer/lib/utils';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, change, icon, className, trend }: StatCardProps) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-600';
    if (trend === 'down') return 'text-error-600';
    if (change !== undefined) {
      return change >= 0 ? 'text-success-600' : 'text-error-600';
    }
    return 'text-text-tertiary';
  };

  return (
    <Card
      shadow="sm"
      hover="lift"
      className={cn('relative overflow-hidden', className)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-2">{title}</p>
          <p className="text-4xl font-bold text-text-primary">{value}</p>
          {change !== undefined && (
            <p className={cn('text-sm mt-2 font-medium', getTrendColor())}>
              {change >= 0 ? '+' : ''}
              {change}%
            </p>
          )}
        </div>
        {icon && (
          <div className="text-primary-500 opacity-20 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
