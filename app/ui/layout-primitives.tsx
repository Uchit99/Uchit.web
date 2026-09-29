import type { ComponentProps, ReactNode } from "react";

type Classed = { className?: string; children: ReactNode };

export function Container({ className = "", children }: Classed) {
  return <div className={`site-container ${className}`.trim()}>{children}</div>;
}

export function Section({ className = "", children, ...props }: ComponentProps<"section">) {
  return <section className={`site-section ${className}`.trim()} {...props}>{children}</section>;
}

export function SectionHeader({
  className = "",
  eyebrow,
  title,
  description,
}: {
  className?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className={`uchit-section-top ${className}`.trim()}>
      <div>
        <span>{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}

export function Grid({ className = "", children }: Classed) {
  return <div className={`site-grid ${className}`.trim()}>{children}</div>;
}

export function Stack({ className = "", children }: Classed) {
  return <div className={`site-stack ${className}`.trim()}>{children}</div>;
}
