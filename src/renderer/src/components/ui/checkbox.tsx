import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'h-[18px] w-[18px] shrink-0 rounded border-2 border-border-medium bg-background-primary',
      'transition-all duration-200',
      'hover:border-border-dark',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-primary-600 data-[state=checked]:border-primary-600',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
      <Check className="h-3.5 w-3.5 animate-in zoom-in-50 duration-150" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
