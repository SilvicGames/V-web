import { cn } from "@/lib/utils";

export function VIcon({ className }: { className?: string }) {
    return (
        <span className={cn(
            "font-display text-outline",
            className
        )}>
            V
        </span>
    )
}
