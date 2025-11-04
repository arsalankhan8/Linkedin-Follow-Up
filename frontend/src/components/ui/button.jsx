import * as React from "react"
import { cn } from "@/lib/utils"


export const Button = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "px-3 py-2 rounded-md text-sm border flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        className
      )}
      {...props}
    />
  )
})

Button.displayName = "Button"
