import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 hover:shadow-lg active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-white shadow-elegant hover:shadow-glow backdrop-blur-sm",
        destructive: "bg-destructive text-white hover:bg-destructive/90 shadow-lg",
        outline: "border-2 border-input bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground shadow-card",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-card",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-gradient-success text-purple-300 shadow-success hover:shadow-glow backdrop-blur-sm hover:scale-105 transition-all duration-300 border border-success/20 [&_svg]:text-purple-300",
        warning: "bg-gradient-warning text-white shadow-warning hover:shadow-glow backdrop-blur-sm hover:scale-105 transition-all duration-300 border border-warning/20",
        info: "bg-gradient-info text-white shadow-info hover:shadow-glow backdrop-blur-sm",
        teal: "bg-gradient-teal-purple text-white shadow-elegant hover:shadow-glow backdrop-blur-sm",
        sunset: "bg-gradient-sunset text-white shadow-elegant hover:shadow-glow backdrop-blur-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
