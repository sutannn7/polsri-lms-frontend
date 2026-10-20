import { memo, useEffect, useRef, useState } from "react";

// The left panel only exists on desktop widths (see LoginPage.css).
const DESKTOP = "(min-width: 901px)";

const STREAMS_DESKTOP = 90;
const PARTICLES_DESKTOP = 14;
// The mobile panel is a short banner, so it gets a quarter of the particles.
const STREAMS_MOBILE = 48;
const PARTICLES_MOBILE = 6;
const PARTICLE_SPEED = 0.0016;
const PARTICLE_JITTER = 0.0012;
const DOT_SIZE = 2.5;
const DPR_CAP = 1.5;

// Four alpha buckets so the dots can be filled in a few passes instead of one
// fillRect per particle.
const DOT_BUCKETS = [
  "rgba(255, 255, 255, 0.22)",
  "rgba(255, 255, 255, 0.38)",
  "rgba(255, 255, 255, 0.62)",
  "rgba(255, 193, 7, 0.6)",
];

function bezier(t, p0, p1, p2, p3) {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;
  return {
    x:
      uu * u * p0.x +
      3 * uu * t * p1.x +
      3 * u * tt * p2.x +
      tt * t * p3.x,
    y:
      uu * u * p0.y +
      3 * uu * t * p1.y +
      3 * u * tt * p2.y +
      tt * t * p3.y,
  };
}

function FlowCanvas() {
  const canvasRef = useRef(null);
  const [desktop, setDesktop] = useState(() =>
    window.matchMedia(DESKTOP).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(DESKTOP);
    const onChange = (event) => setDesktop(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // The streams never move, so they are drawn once into an offscreen canvas
    // and blitted every frame. Redrawing 90 dashed bezier curves per frame is
    // what makes the reference version slow.
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");

    let width = 0;
    let height = 0;
    let streams = [];
    const buckets = [[], [], [], []];
    let raf = 0;
    let buildTimer = 0;
    let started = false;
    let last = performance.now();

    const build = () => {
      const count = desktop ? STREAMS_DESKTOP : STREAMS_MOBILE;
      const perStream = desktop ? PARTICLES_DESKTOP : PARTICLES_MOBILE;
      streams = Array.from({ length: count }, (_, i) => {
        const fromLeft = i % 2 === 0;
        const startY = (i / count) * height * 1.5 - height * 0.25;
        return {
          p0: { x: fromLeft ? 0 : width, y: startY },
          p1: { x: fromLeft ? width * 0.25 : width * 0.75, y: startY },
          p2: { x: fromLeft ? width * 0.4 : width * 0.6, y: height / 2 },
          p3: { x: width / 2, y: height / 2 },
          // Every fifth stream is gold, the rest fade from white to gold.
          gold: i % 5 === 0,
          particles: Array.from({ length: perStream }, () => ({
            t: Math.random(),
            speed: PARTICLE_SPEED + Math.random() * PARTICLE_JITTER,
            gold: Math.random() < 0.12,
          })),
        };
      });
    };

    const paintStreams = () => {
      offCtx.clearRect(0, 0, width, height);

      const glow = offCtx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.min(width, height) * 0.5,
      );
      glow.addColorStop(0, "rgba(255, 193, 7, 0.10)");
      glow.addColorStop(0.4, "rgba(255, 193, 7, 0.035)");
      glow.addColorStop(1, "rgba(255, 193, 7, 0)");
      offCtx.fillStyle = glow;
      offCtx.fillRect(0, 0, width, height);

      offCtx.lineWidth = 1.4;
      offCtx.setLineDash([2, 6]);
      for (const stream of streams) {
        // Each stream fades from the edge towards the convergence point, so
        // the light gathers in the middle. Every fifth stream is gold.
        const gradient = offCtx.createLinearGradient(
          stream.p0.x,
          stream.p0.y,
          stream.p3.x,
          stream.p3.y,
        );
        if (stream.gold) {
          gradient.addColorStop(0, "rgba(255, 193, 7, 0.05)");
          gradient.addColorStop(0.55, "rgba(255, 193, 7, 0.17)");
          gradient.addColorStop(1, "rgba(255, 226, 150, 0.4)");
        } else {
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.05)");
          gradient.addColorStop(0.55, "rgba(255, 255, 255, 0.16)");
          gradient.addColorStop(1, "rgba(255, 193, 7, 0.32)");
        }
        offCtx.strokeStyle = gradient;
        offCtx.beginPath();
        offCtx.moveTo(stream.p0.x, stream.p0.y);
        offCtx.bezierCurveTo(
          stream.p1.x,
          stream.p1.y,
          stream.p2.x,
          stream.p2.y,
          stream.p3.x,
          stream.p3.y,
        );
        offCtx.stroke();
      }
      offCtx.setLineDash([]);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      off.width = canvas.width;
      off.height = canvas.height;
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!started) return;
      // Building the streams means stroking 90 dashed curves. Doing that in
      // the middle of the reveal animations holds back the first paint, so it
      // waits for the next frame.
      window.clearTimeout(buildTimer);
      buildTimer = window.setTimeout(() => {
        build();
        paintStreams();
        draw(0);
      }, 0);
    };

    const draw = (dt) => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(off, 0, 0, off.width, off.height, 0, 0, width, height);

      for (const bucket of buckets) bucket.length = 0;
      for (const stream of streams) {
        for (const particle of stream.particles) {
          particle.t += particle.speed * dt;
          if (particle.t > 1) particle.t -= 1;
          const pos = bezier(
            particle.t,
            stream.p0,
            stream.p1,
            stream.p2,
            stream.p3,
          );
          // Brighter the closer a particle gets to the convergence point.
          const bucket = particle.gold
            ? 3
            : particle.t > 0.8
              ? 2
              : particle.t > 0.5
                ? 1
                : 0;
          buckets[bucket].push(pos.x, pos.y);
        }
      }

      for (let i = 0; i < buckets.length; i += 1) {
        const points = buckets[i];
        if (!points.length) continue;
        ctx.fillStyle = DOT_BUCKETS[i];
        ctx.beginPath();
        for (let j = 0; j < points.length; j += 2) {
          ctx.rect(
            points[j] - DOT_SIZE / 2,
            points[j + 1] - DOT_SIZE / 2,
            DOT_SIZE,
            DOT_SIZE,
          );
        }
        ctx.fill();
      }
    };

    const loop = (now) => {
      const dt = Math.min((now - last) / (1000 / 60), 3);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf && !reduceMotion) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    // The flow is decoration, so it waits until the content has revealed
    // itself. It fades in on top of that.
    buildTimer = window.setTimeout(() => {
      started = true;
      build();
      paintStreams();
      draw(0);
      if (!reduceMotion) raf = requestAnimationFrame(loop);
    }, 500);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(buildTimer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [desktop]);

  return <canvas ref={canvasRef} className="flow-canvas" aria-hidden="true" />;
}

export default memo(FlowCanvas);
