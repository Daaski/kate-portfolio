import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

// Иконка — children: размер и цвет svg задаёт вариант, вызывающий передаёт голую иконку.
// Кнопка из Figma: 48 с иконкой 16 (secondary), 52 с иконкой 20 (primary). В Figma иконка
// без полей, а Phosphor рисует глиф X на ~5/8 холста — svg крупнее: 26 → 16, 32 → 20.
// secondary в Figma — два вида: до lg белая с рамкой и тенью и откликом на тап (active),
// от lg серая с hover. Рамка прозрачная, а не убранная: обводка в Figma внутри 48, размер не прыгает.
export const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full",
  {
    defaultVariants: { variant: "secondary" },
    variants: {
      variant: {
        primary: "size-13 bg-bg-inverse text-fg-inverse *:size-8",
        secondary:
          "size-12 border border-border-subtle bg-bg-page text-fg-tertiary shadow-xl *:size-6.5 active:border-transparent active:bg-bg-muted active:text-fg-primary active:shadow-none motion-safe:transition motion-safe:duration-300 lg:border-transparent lg:bg-bg-surface lg:shadow-none lg:hover:bg-bg-muted lg:hover:text-fg-primary",
      },
    },
  }
);

type IconButtonProps = ComponentProps<"button"> &
  VariantProps<typeof iconButtonVariants>;

export function IconButton({
  className,
  type = "button",
  variant,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={iconButtonVariants({ className, variant })}
      type={type}
      {...props}
    />
  );
}
