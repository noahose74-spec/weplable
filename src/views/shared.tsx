import type { ReactNode } from 'react';

export function PageFrame({
  title,
  description,
  children,
  inspector
}: {
  title: string;
  description: string;
  children: ReactNode;
  inspector: ReactNode;
}) {
  return (
    <>
      <section className="main-panel">
        <div className="page-header">
          <div>
            <p className="eyebrow">WePlable</p>
            <h2>{title}</h2>
            <p className="page-description">{description}</p>
          </div>
        </div>
        {children}
      </section>
      <aside className="inspector-panel">{inspector}</aside>
    </>
  );
}

export function SectionCard({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section className="section-card">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h3>{title}</h3>
      {children}
    </section>
  );
}
