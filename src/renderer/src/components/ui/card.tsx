import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@renderer/lib/utils';

const cardVariants = cva(
  'rounded-lg bg-surface-raised transition-all duration-200',
  {
    variants: {
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md hover:shadow-lg',
        lg: 'shadow-lg hover:shadow-xl',
      },
      border: {
        none: '',
        light: 'border border-border-light',
        medium: 'border border-border-medium',
        highlight: 'border-2 border-primary-500',
      },
      padding: {
        none: '',
        compact: 'p-4',
        default: 'p-6',
        spacious: 'p-8',
      },
      hover: {
        none: '',
        lift: 'hover:-translate-y-1',
        subtle: 'hover:-translate-y-0.5',
      },
    },
    defaultVariants: {
      shadow: 'sm',
      border: 'light',
      padding: 'default',
      hover: 'none',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, shadow, border, padding, hover, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ shadow, border, padding, hover }), className)}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-text-primary', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-text-secondary', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-4', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
