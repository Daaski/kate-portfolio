import { CopyButton } from "@/app/_components/copy-button";
import { contacts } from "@/constants/contacts";
import { buttonVariants } from "@/ui-kit/button";

export function Contacts() {
  return (
    <ul className="flex gap-6">
      {contacts.map((contact) => (
        <li
          className="flex flex-1 flex-col items-start gap-2"
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
