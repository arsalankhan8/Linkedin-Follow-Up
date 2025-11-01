import * as React from "react"
import { cn } from "@/lib/utils"


export const Button = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "px-3 py-2 rounded-md text-sm border bg-white hover:bg-gray-50",
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"
