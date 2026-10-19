import { memo, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

// Same breakpoint as the desktop composition in LoginPage.css.
const DESKTOP = "(min-width: 901px)";

// The flowing lines from the reference, cut to 20 per side. Width, opacity and
// duration are derived from the index so nothing is random: the page re-renders
// on every keystroke and the animation must not restart.
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
    width: 0.5 + i * 0.035,
    opacity: (0.09 + i * 0.01) * (i % 7 === 0 ? 1.35 : 1),
    gold: i % 7 === 0,
    duration: 22 + ((i * 3 + (position > 0 ? 0 : 2)) % 8) * 1.6,
  }));
}

const PATHS = [...buildPaths(1), ...buildPaths(-1)];

function FloatingPaths() {
  const reduceMotion = useReducedMotion();
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
        {PATHS.map((path) =>
          reduceMotion ? (
            <path
              key={path.id}
              d={path.d}
              stroke={path.gold ? "#ffc107" : "currentColor"}
              strokeWidth={path.width}
              strokeOpacity={path.opacity}
            />
          ) : (
            <motion.path
              key={path.id}
              d={path.d}
              stroke={path.gold ? "#ffc107" : "currentColor"}
              strokeWidth={path.width}
              strokeOpacity={path.opacity}
              strokeLinecap="round"
              initial={{ pathLength: 0.3, opacity: 0.55 }}
              animate={{
                pathLength: 1,
                pathOffset: [0, 1],
                opacity: [0.55, 1, 0.55],
              }}
              transition={{
                duration: path.duration,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ),
        )}
      </svg>
    </div>
  );
}

export default memo(FloatingPaths);
