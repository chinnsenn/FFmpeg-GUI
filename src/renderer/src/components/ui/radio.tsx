import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { cn } from '@renderer/lib/utils';

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root className={cn('space-y-2', className)} {...props} ref={ref} />
));

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'h-5 w-5 rounded-full border-2 border-border-medium text-primary-600',
      'transition-all duration-200',
      'hover:border-border-dark',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-primary-600',
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <div className="h-2.5 w-2.5 rounded-full bg-primary-600 animate-in zoom-in-50 duration-150" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
