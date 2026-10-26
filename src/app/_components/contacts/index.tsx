import { CopyButton } from "@/app/_components/copy-button";
import { contacts } from "@/constants/contacts";
import { buttonVariants } from "@/ui-kit/button";

export function Contacts() {
  return (
    <ul className="flex flex-col gap-4 max-lg:px-2 lg:flex-row lg:gap-6">
      {contacts.map((contact) => (
        <li
          className="flex flex-col items-start gap-2 lg:flex-1"
          key={contact.href}
        >
          <span className="text-fg-tertiary text-sm">{contact.label}</span>
          <a
            className={buttonVariants({
              className: contact.copyOnDesktop && "lg:hidden",
              variant: "tertiary",
            })}
            href={contact.href}
          >
            {contact.text}
          </a>
          {contact.copyOnDesktop ? <CopyButton text={contact.text} /> : null}
        </li>
      ))}
    </ul>
  );
}
