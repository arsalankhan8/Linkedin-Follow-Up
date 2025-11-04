import * as React from "react";


export function Separator({ className = "" }) {
  return (
    <div className={`h-px w-full bg-neutral-200 dark:bg-neutral-700 ${className}`} />
  );
}
