import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full py-2",
  {
    defaultVariants: { variant: "secondary" },
    variants: {
      variant: {
        overlay:
          "bg-bg-overlay px-3 font-medium text-fg-inverse text-xs backdrop-blur-xs",
        secondary:
          "bg-bg-surface px-3 font-semibold text-fg-tertiary text-sm hover:text-fg-primary",
        tertiary:
          "relative font-medium text-fg-primary text-sm after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
      },
    },
  }
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  type = "button",
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ className, variant })}
      type={type}
      {...props}
    />
  );
}
