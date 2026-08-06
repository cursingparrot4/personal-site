import next from "eslint-config-next/core-web-vitals";

/**
 * Flat config, which is the only kind ESLint 10 reads — `.eslintrc.json` is no
 * longer looked at. It's also no longer run through `next lint`, which Next 16
 * removed; `npm run lint` calls the ESLint CLI directly.
 *
 * One consequence worth knowing: `next lint` only ever looked at app/,
 * components/, lib/ and pages/. `eslint .` looks at everything, so cli/ is now
 * linted too — it's published to npm and had been getting less scrutiny than
 * the code that only ever runs here.
 */
const config = [
  {
    ignores: [".next/**", "out/**", "next-env.d.ts", "docs/**"],
  },
  ...next,
];

export default config;
