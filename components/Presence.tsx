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
 *  can carry `--text` against a muted verb without the accent being spent here. */
type Line = { verb: string; subject?: string };

const SOCKET = "wss://api.lanyard.rest/socket";

/** Fallback wording when nothing is playing. Idle means the machine has gone
 *  untouched, so "online" would overstate it; offline is handled by rendering
 *  nothing at all rather than by a word. */
const STATUS_WORD: Record<string, string> = {
  online: "online",
  idle: "away",
  dnd: "busy",
};

/** Give up after this many consecutive failures so a dead service can't turn into
 *  an unbounded reconnect loop. Reset by any presence message that arrives. */
const MAX_RETRIES = 5;

/**
 * What to say about a presence, or `null` for "say nothing".
 *
 * Discord activity types: 0 playing, 1 streaming, 2 listening, 3 watching,
 * 4 custom status, 5 competing. Only 0 and Spotify are surfaced — a custom status
 * is text the user wrote, not something they're doing, and rich-presence `details`
 * ("Editing README.md") is more than a sidebar line should leak.
 */
function describe(p: Lanyard): Line | null {
  if (p.discord_status === "offline") return null;

  const game = p.activities?.find((a) => a.type === 0 && a.name);
  if (game?.name) return { verb: "playing", subject: game.name };

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
    };
  }

  const word = STATUS_WORD[p.discord_status];
  return word ? { verb: word } : null;
}

/**
 * Live Discord presence for the rail's availability block, over Lanyard's
 * WebSocket (https://github.com/Phineas/lanyard). Renders nothing at all when
 * there's no id, when the socket never connects, or when the account is offline —
 * the block above it already stands on its own, so a failure is invisible rather
 * than a broken row.
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

  const full = line.subject ? `${line.verb} ${line.subject}` : line.verb;
  return (
    // Truncated by CSS when a track title is long — `title` keeps the whole string.
    <p className={styles.presence} title={full}>
      {line.verb}
      {line.subject ? <span className={styles.presenceSubject}> {line.subject}</span> : null}
    </p>
  );
}
