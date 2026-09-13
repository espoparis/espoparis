export function InstitutionalGeometry({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden="true" focusable="false" className={className}>
      <g stroke="currentColor" strokeWidth="0.7">
        <path d="M33 33h94v94H33z" />
        <path d="M80 14l66 66-66 66-66-66z" />
        <path d="M33 33l94 94M127 33l-94 94M80 14v132M14 80h132" opacity=".4" />
      </g>
    </svg>
  );
}
