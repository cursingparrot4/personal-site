import NextLink from "next/link";

/**
 * Every link on the site goes through one of these two.
 *
 * Colour and underline come from the `link-*` utilities in globals.css, so a
 * caller styles a link by passing those classes rather than by re-declaring the
 * hover recipe in its own module.
 */

type ExternalProps = {
  href: string;
  children: React.ReactNode;
  /** styling is the caller's job — pass the link-* utilities you want */
  className?: string;
};

/** An off-site link: new tab, safe `rel`, trailing ↗. Carries no colours of its own. */
export function ExternalLink({ href, children, className }: ExternalProps) {
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

type InlineProps = ExternalProps & {
  /** external links open in a new tab and show a trailing ↗ */
  external?: boolean;
};

/**
 * The standard text link — body-coloured, accent underline on hover. Use this
 * in prose; use ExternalLink directly when the surrounding block sets its own
 * colour (the rail, the footer, project rows).
 */
export function InlineLink({ href, children, external, className }: InlineProps) {
  const cls = ["link-text", "link-underline", className].filter(Boolean).join(" ");

  if (external) {
    return (
      <ExternalLink href={href} className={cls}>
        {children}
      </ExternalLink>
    );
  }

  return (
    <NextLink href={href} className={cls}>
      {children}
    </NextLink>
  );
}
