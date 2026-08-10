interface SectionHeadingProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}

export function SectionHeading({ icon: Icon, children }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-semibold whitespace-nowrap text-foreground">
        <Icon size={16} className="text-primary" />
        {children}
      </div>
      <div className="h-px flex-1 bg-linear-to-r from-border to-transparent" />
    </div>
  );
}
