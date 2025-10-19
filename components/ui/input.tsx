import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <input
        type={type}
        data-slot="input"
        placeholder="Find community or post"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
          // Changed background and border colors
          "dark:bg-slate-800 border-slate-300 dark:border-slate-700 h-10 w-full min-w-0 rounded-md border bg-slate-100",
          // Added left padding for the icon
          "py-2 pl-10 pr-4 text-base shadow-sm transition-[color,box-shadow] outline-none",
          "file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          // Maintained focus and invalid states
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }
