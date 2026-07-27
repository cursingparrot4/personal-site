/** Mono pill with a dim accent outline, no fill. Used for stack items. */
export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tag mono">{children}</span>;
}
