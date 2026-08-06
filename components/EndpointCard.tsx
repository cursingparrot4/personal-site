"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import styles from "./EndpointCard.module.css";

const host = new URL(site.url).host;

type Client = {
  id: string;
  /** what the picker calls it */
  label: string;
  method: string;
  path: string;
  command: string;
  /** the response line under the command — what you actually get back */
  returns: string;
  /** the shell-comment aside under the card: a nudge toward npx from the HTTP
   *  clients, and the keymap once you're on it */
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
    path: "/",
    command: `curl -L ${host}`,
    returns: "200 · text/plain; charset=utf-8",
    hint: "npx is interactive, if you trust me...",
  },
  {
    id: "powershell",
    label: "PowerShell",
    method: "GET",
    path: "/",
    command: `irm ${site.url}`,
    returns: "200 · text/plain; charset=utf-8",
    // Same nudge as cURL. The `irm` rationale doesn't belong here — three lines
    // of aside under a four-line card is the tail wagging the dog, and the
    // README carries the explanation.
    hint: "npx is interactive, if you trust me...",
  },
  {
    id: "npx",
    label: "npx",
    method: "RUN",
    // No "npm:" prefix. The select is sized by its widest option ("PowerShell")
    // whatever is chosen, so the path column is narrower than it looks and the
    // longer string ellipsised. The command underneath says npx anyway.
    path: "aryanahlawat",
    command: "npx aryanahlawat",
    returns: "interactive · resizable",
    hint: "arrow keys, ⏎ expands. bold of you.",
  },
];

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
 * A `<select>` rather than a custom dropdown or a tablist — it's what the
 * reference pattern uses, it survives a 20rem column, and it arrives keyboard
 * accessible without a line of key handling.
 */
export function EndpointCard() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const active = CLIENTS[index];
  const [bin, ...args] = active.command.split(" ");

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

  return (
    <div>
      <div className={styles.card}>
        <div className={styles.head}>
          <span className={`${styles.method} mono`} data-method={active.method}>
            {active.method}
          </span>
          <code className={`${styles.path} mono`}>{active.path}</code>

          <span className={styles.picker}>
            <select
              className={`${styles.select} mono`}
              aria-label="Client"
              value={active.id}
              onChange={(e) => {
                setIndex(CLIENTS.findIndex((c) => c.id === e.target.value));
                setCopied(false);
              }}
            >
              {CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <span className={styles.chevron} aria-hidden="true">
              ⌄
            </span>
          </span>

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

        <div className={styles.body}>
          <code className={`${styles.command} mono`}>
            <span className={styles.prompt} aria-hidden="true">
              $
            </span>
            <span>
              <span className={styles.bin}>{bin}</span> {args.join(" ")}
            </span>
          </code>
        </div>

        <p className={`${styles.returns} mono`}>{active.returns}</p>

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
