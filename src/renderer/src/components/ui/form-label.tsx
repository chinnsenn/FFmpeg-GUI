import * as React from 'react';
import { cn } from '@renderer/lib/utils';

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn('block text-sm font-medium text-text-primary mb-2', className)}
      {...props}
    >
      {children}
      {required && <span className="text-error-500 ml-1">*</span>}
    </label>
  )
);

FormLabel.displayName = 'FormLabel';
