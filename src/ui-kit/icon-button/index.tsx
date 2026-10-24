import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

// Иконка — children: размер и цвет svg задаёт вариант, вызывающий передаёт голую иконку.
// Кнопка из Figma: 48 с иконкой 16 (secondary, tertiary), 52 с иконкой 20 (primary). В Figma иконка
// без полей, а Phosphor рисует глиф X на ~5/8 холста — svg крупнее: 26 → 16, 32 → 20.
// tertiary — белая с тенью поверх контента (стрелка «Следующий слайд», 365:18235).
export const iconButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full",
  {
    defaultVariants: { variant: "secondary" },
    variants: {
      variant: {
        primary: "size-13 bg-bg-inverse text-fg-inverse *:size-8",
        secondary:
          "size-12 bg-bg-surface text-fg-tertiary *:size-6.5 hover:text-fg-primary",
        tertiary:
          "size-12 bg-bg-page text-fg-tertiary shadow-xl *:size-6.5 hover:text-fg-primary",
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
