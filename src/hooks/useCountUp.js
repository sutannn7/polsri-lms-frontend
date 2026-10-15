import { useEffect, useRef, useState } from 'react';

function useCountUp(value, enabled = true, duration = 850) {
  const elementRef = useRef(null);
  const [count, setCount] = useState(value);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) {
      setCount(value);
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      setCount(value);
      return undefined;
    }

    let frameId = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      const startTime = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setCount(Math.round(value * easedProgress));
        if (progress < 1) frameId = window.requestAnimationFrame(animate);
      };

      setCount(0);
      frameId = window.requestAnimationFrame(animate);
    }, { threshold: 0.35 });

    observer.observe(element);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
    };
  }, [duration, enabled, value]);

  return { count, elementRef };
}

export default useCountUp;
