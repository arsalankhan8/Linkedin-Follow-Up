"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export function Tooltip({ children, ...props }) {
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef(
  ({ className = "", sideOffset = 6, children, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`
        z-50 overflow-hidden rounded-md bg-black text-white 
        px-2 py-1 text-xs shadow-md animate-in fade-in-0 zoom-in-95
        ${className}
      `}
      {...props}
    >
      {children}
    </TooltipPrimitive.Content>
  )
);

TooltipContent.displayName = "TooltipContent";
