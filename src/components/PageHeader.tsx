import type { Route } from "next";
import Link from "next/link";

type PageHeaderProps = {
  title: string;
  description?: string;
  backHref?: Route;
  backLabel?: string;
};

export function PageHeader({ title, description, backHref, backLabel }: PageHeaderProps) {
  return (
    <header className="header">
      {backHref && backLabel ? (
        <p>
          <Link href={backHref}>{backLabel}</Link>
        </p>
      ) : null}
      <h1 className="title">{title}</h1>
      {description ? <p className="subtle">{description}</p> : null}
    </header>
  );
}