import * as React from "react"
import { cn } from "@/lib/utils"


export function Badge({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      {...props}
    />
  )
}