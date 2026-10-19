import { useEffect, useId, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import '../../styles/tracing-beam.css';

// Port of Aceternity's TracingBeam. The rail height follows the content, so
// switching tabs in the course page keeps the beam aligned (ResizeObserver).
export default function TracingBeam({ children, className = '' }) {
  const ref = useRef(null);
  const contentRef = useRef(null);
  const gradientId = useId().replace(/:/g, '');
  const [height, setHeight] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return undefined;

    const update = () => setHeight(node.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [50, height]), {
    stiffness: 500,
    damping: 90,
  });
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, Math.max(height - 200, 0)]),
    { stiffness: 500, damping: 90 },
  );
  const path = `M 1 0 V -36 l 18 24 V ${height * 0.8} l -18 24 V ${height}`;

  return (
    <div ref={ref} className={`tracing-beam ${className}`.trim()}>
      <div className="tracing-beam-rail" aria-hidden="true">
        <span className="tracing-beam-dot" />
        {height > 0 ? (
          <svg
            viewBox={`0 0 20 ${height}`}
            width="20"
            height={height}
            className="tracing-beam-svg"
            focusable="false"
          >
            <path d={path} fill="none" className="tracing-beam-line" />
            <motion.path
              d={path}
              fill="none"
              className="tracing-beam-glow"
              stroke={`url(#${gradientId})`}
            />
            <defs>
              <motion.linearGradient
                id={gradientId}
                className="tracing-beam-gradient"
                gradientUnits="userSpaceOnUse"
                x1="0"
                x2="0"
                y1={y1}
                y2={y2}
              >
                <stop stopColor="#0056B3" stopOpacity="0" />
                <stop stopColor="#0056B3" />
                <stop offset="0.325" stopColor="#3B82F6" />
                <stop offset="1" stopColor="#FFC107" stopOpacity="0" />
              </motion.linearGradient>
            </defs>
          </svg>
        ) : null}
      </div>
      <div ref={contentRef} className="tracing-beam-content">
        {children}
      </div>
    </div>
  );
}
