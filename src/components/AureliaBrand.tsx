interface AureliaBrandProps {
  size?: number
  className?: string
}

/**
 * Aurelia AI brand mark — a minimal geometric form suggesting a moon-jelly
 * bell with flowing tentacle strokes beneath it. Deliberately abstract:
 * no face, no cartoon silhouette. Renders crisp at any size (nav-scale
 * through page-header-scale) since it's plain vector paths.
 */
function AureliaBrand({ size = 24, className }: AureliaBrandProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 14 A12 9 0 0 1 28 14 L28 15.6 A12 2.2 0 0 1 4 15.6 Z"
        fill="#D81B60"
      />
      <path
        d="M9 16.5 C 7.8 20, 10.5 22.5, 9 27"
        stroke="#D81B60"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M14 16.8 C 12.8 21, 15.8 23, 14 29"
        stroke="#C2185B"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M18 16.8 C 19.2 21, 16.2 23, 18 29"
        stroke="#D81B60"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M23 16.5 C 24.2 20, 21.5 22.5, 23 27"
        stroke="#C2185B"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  )
}

export default AureliaBrand
