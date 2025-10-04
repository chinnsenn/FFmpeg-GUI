import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@renderer/lib/utils';

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=closed]:animate-out',
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const modalContentVariants = cva(
  'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-surface-raised border border-border-light rounded-lg shadow-lg',
  {
    variants: {
      size: {
        sm: 'w-full max-w-sm',
        md: 'w-full max-w-md',
        lg: 'w-full max-w-lg',
        xl: 'w-full max-w-xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalContentVariants> {}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(({ className, children, size, ...props }, ref) => (
  <ModalPortal>
    <ModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        modalContentVariants({ size }),
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-top-[2%] data-[state=open]:slide-in-from-top-[2%]',
        'duration-200',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-1.5 p-6 border-b border-border-light', className)}
    {...props}
  />
);
ModalHeader.displayName = 'ModalHeader';

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-text-primary', className)}
    {...props}
  />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-text-secondary', className)}
    {...props}
  />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

const ModalBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6', className)} {...props} />
);
ModalBody.displayName = 'ModalBody';

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center justify-end gap-3 p-6 border-t border-border-light', className)}
    {...props}
  />
);
ModalFooter.displayName = 'ModalFooter';

const ModalCloseButton = () => (
  <DialogPrimitive.Close
    className={cn(
      'absolute right-4 top-4 rounded-md p-1.5',
      'text-text-tertiary hover:text-text-primary hover:bg-background-secondary',
      'transition-colors duration-150',
      'focus:outline-none focus:ring-2 focus:ring-primary-500'
    )}
  >
    <X className="h-5 w-5" />
    <span className="sr-only">关闭</span>
  </DialogPrimitive.Close>
);
ModalCloseButton.displayName = 'ModalCloseButton';

export {
  Modal,
  ModalTrigger,
  ModalPortal,
  ModalClose,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
};
