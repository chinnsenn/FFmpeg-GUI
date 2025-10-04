import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@renderer/lib/utils';

const buttonVariants = cva(
  // Base styles - shared across all variants
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        // Primary: Blue background, white text, shadow with lift on hover
        primary:
          'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
        // Secondary: Light gray background, dark text, border
        secondary:
          'bg-background-tertiary text-text-primary border border-border-medium hover:bg-border-light hover:border-border-dark active:scale-[0.98]',
        // Ghost: Transparent background, subtle hover
        ghost:
          'bg-transparent text-text-secondary hover:bg-background-tertiary hover:text-text-primary active:scale-[0.98]',
        // Destructive: Red background, white text, shadow with lift on hover
        destructive:
          'bg-error-600 text-white shadow-sm hover:bg-error-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
        // Icon: Transparent background, icon-only styling
        icon: 'bg-transparent text-text-secondary hover:bg-background-tertiary hover:text-text-primary active:scale-[0.98]',
      },
      size: {
        // Small: 32px height, 12px font
        sm: 'h-8 text-xs',
        // Medium: 40px height, 14px font (default)
        md: 'h-10 text-sm',
        // Large: 48px height, 16px font
        lg: 'h-12 text-base',
      },
    },
    // Compound variants for size-specific padding
    compoundVariants: [
      // Icon variant - square buttons
      {
        variant: 'icon',
        size: 'sm',
        className: 'w-8 px-0',
      },
      {
        variant: 'icon',
        size: 'md',
        className: 'w-10 px-0',
      },
      {
        variant: 'icon',
        size: 'lg',
        className: 'w-12 px-0',
      },
      // Non-icon variants - horizontal padding
      {
        variant: ['primary', 'secondary', 'ghost', 'destructive'],
        size: 'sm',
        className: 'px-3',
      },
      {
        variant: ['primary', 'secondary', 'ghost', 'destructive'],
        size: 'md',
        className: 'px-6',
      },
      {
        variant: ['primary', 'secondary', 'ghost', 'destructive'],
        size: 'lg',
        className: 'px-8',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon}
        {children}
        {!loading && rightIcon}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
