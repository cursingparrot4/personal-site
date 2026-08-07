"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import styles from "./EndpointCard.module.css";

const host = new URL(site.url).host;

type Client = {
  id: string;
  /** what the tab calls it */
  label: string;
  method: string;
  /** dim half of the url bar — the part that's the same for every endpoint */
  base: string;
  /** bright half — the part that identifies this one */
  path: string;
  command: string;
  /** the response line under the command — what you actually get back. Split on
   *  the "·" into a status code and a content type. */
  returns: string;
  /** the shell-comment aside under the card: a nudge toward npx from the HTTP
   *  clients, and — once you're on it — the only line on the page that sounds
   *  pleased with itself.
   *
   *  The nudge is declarative on purpose. It used to trail into "...if you trust
   *  me", which raised the question it was trying to settle: `npx` on a
   *  stranger's package is exactly the doubt the visitor already has, and naming
   *  it hands them a reason to hesitate rather than an answer.
   *
   *  Deliberately not a keymap either: the app names its own keys in its footer,
   *  contextually, which a static line here can't do. */
  hint: string;
};

/**
 * Three ways in, in the order most people will want them. PowerShell earns its
 * own entry rather than a footnote: `curl` there is an alias for
 * `Invoke-WebRequest`, which returns an object instead of the page, so the
 * obvious command is the one that doesn't work.
 *
 * Both HTTP commands carry something that looks like noise and isn't. A bare
 * hostname means `http://`, and the host force-upgrades that to https with a
 * 308 — so `curl` needs `-L` to follow it, and PowerShell needs the scheme
 * spelled out because Windows PowerShell 5.1 errors on a 308 instead of
 * following it. Drop either and the command returns 14 bytes of "Redirecting…".
 */
const CLIENTS: Client[] = [
  {
    id: "curl",
    label: "cURL",
    method: "GET",
    base: host,
    path: "/",
    command: `curl -L ${host}`,
    returns: "200 · text/plain; charset=utf-8",
    hint: "npx is interactive",
  },
  {
    id: "powershell",
    label: "PowerShell",
    method: "GET",
    base: host,
    path: "/",
    command: `irm ${site.url}`,
    returns: "200 · text/plain; charset=utf-8",
    // Same nudge as cURL. The `irm` rationale doesn't belong here — three lines
    // of aside under a four-line card is the tail wagging the dog, and the
    // README carries the explanation.
    hint: "npx is interactive",
  },
  {
    id: "npx",
    label: "npx",
    method: "RUN",
    // No "npm:" prefix — the bare package name is what you'd type, and the
    // command underneath says npx anyway.
    base: "npx ",
    path: "aryanahlawat",
    command: "npx aryanahlawat",
    returns: "interactive · resizable",
    hint: "yippee!! (still a wip)",
  },
];

/** "200 · text/plain; charset=utf-8" -> ["200", "text/plain; charset=utf-8"].
 *  Anything without a leading status code (npx) returns a null code, and the
 *  dot goes inert rather than pretending there was a response. */
function splitStatus(returns: string): [string | null, string] {
  const m = /^(\d{3})\s·\s(.*)$/.exec(returns);
  return m ? [m[1], m[2]] : [null, returns];
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" />
      <path d="M10.5 2.5H3a.5.5 0 0 0-.5.5v7.5" stroke="currentColor" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" aria-hidden="true">
      <path
        d="M3 8.5l3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The site, as an API endpoint. Sits beside the bio and says the thing the page
 * otherwise can't: that everything here is also readable from a terminal.
 *
 * Composed as an API reference panel in three bands — url bar, snippet, response
 * — with the clients as a tablist rather than a `<select>`. Three ways in is the
 * card's whole point, and a closed dropdown hides two of them; the cost is
 * having to hand-roll the arrow keys the select gave us for free.
 */
export function EndpointCard() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const active = CLIENTS[index];
  const [bin, ...args] = active.command.split(" ");
  const [code, contentType] = splitStatus(active.returns);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(active.command);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard denied (insecure origin, or the user said no). The command is
      // right there to select by hand — better to do nothing than to alert.
    }
  }

  function select(next: number) {
    setIndex(next);
    setCopied(false);
  }

  /** Left/Right move between clients, wrapping, and take focus with them — the
   *  one thing the `<select>` did for free that the tablist has to earn back. */
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + CLIENTS.length) % CLIENTS.length;
    select(next);
    (e.currentTarget.children[next] as HTMLButtonElement | undefined)?.focus();
  }

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.urlBar}>
          <span className={`${styles.method} mono`} data-method={active.method}>
            {active.method}
          </span>
          <code className={`${styles.url} mono`}>
            <span className={styles.urlBase}>{active.base}</span>
            {active.path}
          </code>
          <button
            type="button"
            className={styles.copy}
            onClick={copy}
            aria-label={`Copy command: ${active.command}`}
            data-copied={copied}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>

        {/* Inverted to --bg: it's what makes the command read as a code block
            sitting inside the panel rather than one more row of its chrome. */}
        <div className={styles.snippet}>
          <div className={styles.clients} role="tablist" aria-label="Client" onKeyDown={onKeyDown}>
            {CLIENTS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`endpoint-tab-${c.id}`}
                aria-selected={i === index}
                aria-controls="endpoint-panel"
                tabIndex={i === index ? 0 : -1}
                className={`${styles.client} mono`}
                data-active={i === index}
                onClick={() => select(i)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div
            className={styles.body}
            id="endpoint-panel"
            role="tabpanel"
            aria-labelledby={`endpoint-tab-${active.id}`}
          >
            <code className={`${styles.command} mono`}>
              <span className={styles.prompt} aria-hidden="true">
                $
              </span>
              <span>
                <span className={styles.bin}>{bin}</span> {args.join(" ")}
              </span>
            </code>
          </div>
        </div>

        <p className={`${styles.response} mono`}>
          <span className={styles.dot} data-status={code ? "ok" : "none"} aria-hidden="true" />
          {code ? <span className={styles.status}>{code}</span> : null}
          <span className={styles.returns}>{contentType}</span>
        </p>

        {/* Announced on copy; the icon swap alone says nothing to a screen reader. */}
        <span aria-live="polite" className={styles.srOnly}>
          {copied ? "Command copied to clipboard" : ""}
        </span>
      </div>

      {/* Outside the card on purpose — it's an aside about the card, in the one
          register a terminal has for asides. */}
      <p className={`${styles.hint} mono`}>
        <span className={styles.hash} aria-hidden="true">
          #
        </span>
        {active.hint}
      </p>
    </div>
  );
}
