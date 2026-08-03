"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * The link between the timeline and the rows underneath it.
 *
 * The chart is a mirror, not a source: rows own their own open state exactly as
 * before, and simply announce it here so the matching mark can light up. Two
 * signals, deliberately distinct:
 *
 *  - `open` — rows currently expanded. Can be more than one, so it's a set.
 *  - `peek` — the single row (or mark) under the pointer or keyboard focus.
 *
 * Everything degrades to nothing without a provider: `/projects` renders
 * `ProjectRow` with no timeline in sight, and the default context below makes
 * that a no-op rather than a crash.
 */
type TimelineCtx = {
  open: ReadonlySet<string>;
  peek: string | null;
  setOpen: (key: string, isOpen: boolean) => void;
  setPeek: (key: string, on: boolean) => void;
};

const EMPTY: ReadonlySet<string> = new Set<string>();
const noop = () => {};

const Ctx = createContext<TimelineCtx>({
  open: EMPTY,
  peek: null,
  setOpen: noop,
  setPeek: noop,
});

/** Namespaced so an org can never collide with a slug. */
export const expKey = (org: string, role: string) => `exp:${org}:${role}`;
export const projKey = (slug: string) => `proj:${slug}`;

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [open, setOpenSet] = useState<ReadonlySet<string>>(EMPTY);
  const [peek, setPeekKey] = useState<string | null>(null);

  const setOpen = useCallback((key: string, isOpen: boolean) => {
    setOpenSet((prev) => {
      if (prev.has(key) === isOpen) return prev; // same set identity = no re-render
      const next = new Set(prev);
      if (isOpen) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  // Only the element that claimed the peek can release it, so a pointer moving
  // straight from one row to the next doesn't blank the highlight on the way.
  const setPeek = useCallback((key: string, on: boolean) => {
    setPeekKey((prev) => (on ? key : prev === key ? null : prev));
  }, []);

  const value = useMemo(() => ({ open, peek, setOpen, setPeek }), [open, peek, setOpen, setPeek]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTimeline() {
  return useContext(Ctx);
}

/**
 * For a row: publish its open state and hand back the handlers that publish
 * hover/focus. Spread the result onto the row's header button.
 */
export function useTimelineSignal(key: string, isOpen: boolean) {
  const { peek, setOpen, setPeek } = useTimeline();

  useEffect(() => {
    setOpen(key, isOpen);
  }, [key, isOpen, setOpen]);

  // Separate effect so the cleanup fires on unmount only — folding it into the
  // one above would clear and re-set the flag on every toggle.
  useEffect(() => () => setOpen(key, false), [key, setOpen]);

  const handlers = useMemo(
    () => ({
      onMouseEnter: () => setPeek(key, true),
      onMouseLeave: () => setPeek(key, false),
      onFocus: () => setPeek(key, true),
      onBlur: () => setPeek(key, false),
    }),
    [key, setPeek],
  );

  return { handlers, peeked: peek === key };
}
