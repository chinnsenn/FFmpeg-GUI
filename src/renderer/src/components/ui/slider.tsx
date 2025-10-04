import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@renderer/lib/utils';

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-border-light">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        'block h-5 w-5 rounded-full border-3 border-white bg-primary-600 shadow-md',
        'transition-transform duration-150',
        'hover:scale-110 active:scale-105',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'cursor-grab active:cursor-grabbing'
      )}
    />
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;
