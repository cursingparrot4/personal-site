"use client";

import { useEffect, useState } from "react";
import styles from "./Rail.module.css";

/** Only the fields the rail actually reads — Lanyard sends a great deal more. */
type Activity = { type: number; name?: string };

type Lanyard = {
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities?: Activity[];
  listening_to_spotify?: boolean;
  spotify?: { song?: string; artist?: string } | null;
};

/** A verb the line leads with, plus the thing it applies to. Split so the subject
 *  can carry `--text` against a muted verb without the accent being spent here.
 *  Both are always present: an activity is the only thing this line reports.
 *  `live` drives the dot: accent while he's reachable, grey once he isn't. */
type Line = { verb: string; subject: string; live: boolean };

const SOCKET = "wss://api.lanyard.rest/socket";

/** Give up after this many consecutive failures so a dead service can't turn into
 *  an unbounded reconnect loop. Reset by any presence message that arrives. */
const MAX_RETRIES = 5;

/** Sentence case for the verb only — the subject is a game or track title and
 *  keeps whatever casing it ships with. Done here rather than in CSS because
 *  `::first-letter` doesn't reach into an inline span, and `capitalize` would
 *  hit every word in the subject. */
const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * What to say about a presence, or `null` for "say nothing".
 *
 * **Only an actual activity earns the line.** A bare status — online, away, busy,
 * offline — returns `null` and the row disappears: "he has Discord open" isn't
 * news, and the availability line below already says whether he's reachable. What
 * he's *doing* is the only part worth a row in the rail.
 *
 * "dnd" still reads as unavailable, so an activity reported while busy takes the
 * grey dot — the dot answers "can you reach him", not "is the client open".
 *
 * Discord activity types: 0 playing, 1 streaming, 2 listening, 3 watching,
 * 4 custom status, 5 competing. Only 0 and Spotify are surfaced — a custom status
 * is text the user wrote, not something they're doing, and rich-presence `details`
 * ("Editing README.md") is more than a sidebar line should leak.
 */
function describe(p: Lanyard): Line | null {
  // Offline can still carry stale activities; nothing it says is worth reporting.
  if (p.discord_status === "offline") return null;

  const live = p.discord_status !== "dnd";

  const game = p.activities?.find((a) => a.type === 0 && a.name);
  if (game?.name) return { verb: "playing", subject: game.name, live };

  if (p.listening_to_spotify && p.spotify?.song) {
    // Lanyard joins multiple artists with "; ".
    const artist = p.spotify.artist
      ?.split(";")
      .map((a) => a.trim())
      .filter(Boolean)
      .join(", ");
    return {
      verb: "listening to",
      subject: artist ? `${p.spotify.song} — ${artist}` : p.spotify.song,
      live,
    };
  }

  return null;
}

/**
 * Live Discord presence for the rail's availability block, over Lanyard's
 * WebSocket (https://github.com/Phineas/lanyard). Renders nothing at all unless
 * there's an activity to name — no id, no socket, or simply nothing being played
 * all collapse to the same empty row. The block below it stands on its own, so
 * both a quiet day and an outage are invisible rather than a broken line.
 *
 * Client-only by nature; the site stays statically rendered (spec §3) because
 * this never runs on the server.
 */
export function Presence({ userId }: { userId?: string }) {
  const [line, setLine] = useState<Line | null>(null);

  useEffect(() => {
    if (!userId) return;

    let socket: WebSocket | null = null;
    let beat = 0;
    let reconnect = 0;
    let retries = 0;
    let stopped = false;

    const open = () => {
      socket = new WebSocket(SOCKET);

      socket.addEventListener("message", (event) => {
        let msg;
        try {
          msg = JSON.parse(event.data as string);
        } catch {
          return;
        }

        // Op 1 (hello) carries the heartbeat interval; subscribing is our reply.
        if (msg.op === 1) {
          socket?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
          beat = window.setInterval(() => {
            socket?.send(JSON.stringify({ op: 3 }));
          }, msg.d?.heartbeat_interval ?? 30_000);
          return;
        }

        if (msg.op !== 0) return;
        if (msg.t !== "INIT_STATE" && msg.t !== "PRESENCE_UPDATE") return;

        // A single-id subscription sends the presence bare; the plural form keys
        // it by user id. Accept either so the payload shape isn't load-bearing.
        const data: Lanyard | undefined = msg.d?.discord_status ? msg.d : msg.d?.[userId];
        if (!data) return;

        retries = 0;
        setLine(describe(data));
      });

      // 'error' is always followed by 'close', so reconnection lives in one place.
      socket.addEventListener("close", () => {
        window.clearInterval(beat);
        if (stopped) return;

        setLine(null);
        if (retries >= MAX_RETRIES) return;
        // 2s, 4s, 8s … so a service that's down isn't hammered.
        reconnect = window.setTimeout(open, 2 ** ++retries * 1000);
      });
    };

    open();

    return () => {
      stopped = true;
      window.clearInterval(beat);
      window.clearTimeout(reconnect);
      socket?.close();
    };
  }, [userId]);

  if (!line) return null;

  const verb = sentence(line.verb);
  const full = `${verb} ${line.subject}`;
  return (
    <p className={styles.presence}>
      {/* Same mark as the availability dot above; grey and still while he's busy. */}
      <span
        className={line.live ? styles.dot : `${styles.dot} ${styles.dotOffline}`}
        aria-hidden="true"
      />
      {/* Truncated by CSS when a track title is long — `title` keeps the whole string. */}
      <span className={styles.presenceText} title={full}>
        {verb}
        <span className={styles.presenceSubject}> {line.subject}</span>
      </span>
    </p>
  );
}
