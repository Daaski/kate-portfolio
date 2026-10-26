import { XIcon } from "@phosphor-icons/react/dist/ssr/X";
import Link from "next/link";
import { routes } from "@/constants/routes";
import { navTypes } from "@/lib/view-transition";
import { iconButtonVariants } from "@/ui-kit/icon-button";

export function CloseLink() {
  return (
    <Link
      aria-label="На главную"
      className={iconButtonVariants()}
      href={routes.home}
      transitionTypes={navTypes}
    >
      <XIcon aria-hidden="true" />
    </Link>
  );
}
