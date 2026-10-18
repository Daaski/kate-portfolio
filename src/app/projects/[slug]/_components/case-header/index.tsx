interface CaseHeaderProps {
  description: string;
  title: string;
}

export function CaseHeader({ title, description }: CaseHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-medium text-3xl tracking-tight">{title}</h1>
      <p className="text-fg-tertiary text-sm">{description}</p>
    </div>
  );
}
