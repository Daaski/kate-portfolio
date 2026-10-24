import { cva } from "class-variance-authority";
import type { ReactNode } from "react";

export type SectionLabelAccent = "blue" | "green" | "pink";

// Слои как в Figma (295:9356): заливка цветом проекта и поверх неё свечение — радиальный градиент
// от светлого центра к тому же цвету. closest-side — эллипс в размер пилюли, как в макете.
const fillVariants = cva("absolute inset-0 -z-10 rounded-full blur-xs", {
  variants: {
    accent: {
      blue: "bg-accent-blue",
      green: "bg-accent-green",
      pink: "bg-accent-pink",
    },
  },
});

const glowVariants = cva(
  "absolute inset-0 -z-10 rounded-full bg-radial-[closest-side] from-50% blur-md",
  {
    variants: {
      accent: {
        blue: "from-gradient-blue to-accent-blue",
        green: "from-gradient-green to-accent-green",
        pink: "from-gradient-pink to-accent-pink",
      },
    },
  }
);

interface SectionLabelProps {
  accent: SectionLabelAccent;
  children: ReactNode;
}

export function SectionLabel({ accent, children }: SectionLabelProps) {
  return (
    <span className="relative isolate inline-flex rounded-full px-6 py-3 font-semibold text-fg-primary text-sm">
      <span aria-hidden="true" className={fillVariants({ accent })} />
      <span aria-hidden="true" className={glowVariants({ accent })} />
      {children}
    </span>
  );
}
