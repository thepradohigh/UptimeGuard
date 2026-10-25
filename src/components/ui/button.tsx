import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]',
        lime: 'bg-lime text-foreground hover:bg-lime/90 active:scale-[0.98] shadow-[0_0_0_1px_rgba(0,0,0,0.05)]',
        outline: 'border hairline bg-transparent hover:bg-muted active:scale-[0.98]',
        ghost: 'hover:bg-muted text-foreground',
        link: 'text-foreground underline-offset-4 hover:underline',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98]',
      },
      size: {
        default: 'h-9 px-4 text-[13px] rounded-md',
        sm: 'h-8 px-3 text-xs rounded-md',
        lg: 'h-11 px-6 text-sm rounded-lg',
        xl: 'h-12 px-8 text-[15px] rounded-lg',
        icon: 'h-9 w-9 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && (
              <span className="mr-2 h-3.5 w-3.5 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
            )}
            {children}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
