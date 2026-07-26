"use client";

import styles from "./NullscapeFilter.module.css";

type Props = {
  /** Overall strength. 0 disables the effect entirely. Design default: 0.2 */
  atmosphere?: number;
  /** Ordered dither + diagonal color bands. */
  dither?: boolean;
  /** Animated film grain. */
  grain?: boolean;
  /** Beam / band hue as "r g b" channels (space separated, for rgb( / ) alpha syntax). */
  beamRgb?: string;
};

/**
 * Nullscape filter — two fixed layer stacks that sandwich the page:
 *   atmosphere (z 0)  behind content: haze, beam, fog, vignette
 *   texture    (z 30) above content: scanlines, dither, bands, grain, color grade
 *
 * Mount once in app/layout.tsx inside <body>. Page content must be
 * position: relative; z-index: 1 to sit between the two stacks.
 */
export default function NullscapeFilter({
  atmosphere = 0.2,
  dither = true,
  grain = true,
  beamRgb = "52 197 221",
}: Props) {
  const k = Math.max(0, Math.min(1.6, atmosphere));
  if (k === 0) return null;

  const vars = { "--ns-k": String(k), "--ns-beam-rgb": beamRgb } as React.CSSProperties;

  return (
    <>
      <div aria-hidden="true" className={styles.atmosphere} style={vars}>
        <div className={styles.haze} />
        <div className={styles.beam} />
        <div className={styles.fog} />
        <div className={styles.vignette} />
      </div>

      <div aria-hidden="true" className={styles.texture} style={vars}>
        <div className={styles.scanlines} />
        {dither && <div className={styles.dither} />}
        {dither && <div className={styles.bands} />}
        {grain && <div className={styles.grain} />}
        <div className={styles.grade} />
      </div>
    </>
  );
}
