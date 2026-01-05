"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/utils"

const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <div className="relative flex items-center">
        <input
            type="checkbox"
            className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-background checked:bg-primary checked:text-primary-foreground"
            ref={ref}
            {...props}
        />
        <Check className="absolute pointer-events-none h-3 w-3 text-primary-foreground opacity-0 peer-checked:opacity-100 left-0.5" strokeWidth={3} />
    </div>
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
