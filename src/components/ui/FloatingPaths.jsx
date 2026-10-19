import { memo, useEffect, useState } from "react";

// Same breakpoint as the desktop composition in LoginPage.css.
const DESKTOP = "(min-width: 901px)";

// The flowing lines from the reference, cut to 20 per side. Width and opacity
// come from the index so nothing is random.
function buildPaths(position) {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `${position}:${i}`,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    opacity: (0.06 + i * 0.007) * (i % 7 === 0 ? 1.3 : 1),
    gold: i % 7 === 0,
  }));
}

const PATHS = [...buildPaths(1), ...buildPaths(-1)];

// The lines stay still on purpose. Animating their dash pattern (pathLength
// and pathOffset) repainted the whole SVG every frame and halved the frame
// rate, and the pattern restarted every cycle so the lines blinked in and out.
// The layer drifts as one composited transform instead — see .login-paths in
// LoginPage.css — which the GPU can handle without repainting.
function FloatingPaths() {
  const [desktop, setDesktop] = useState(() =>
    window.matchMedia(DESKTOP).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const onChange = (event) => setDesktop(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (!desktop) return null;

  return (
    <div className="login-paths" aria-hidden="true">
      <svg viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMin meet">
        {PATHS.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke={path.gold ? "#ffc107" : "currentColor"}
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}

export default memo(FloatingPaths);
