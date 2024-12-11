import { useState, useCallback, useRef, useLayoutEffect } from 'react';

export const useParticles = (particlesRef) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const partsRef = useRef([]);
  const animationRef = useRef(null);

  const createParticles = useCallback((canvas) => {
    const colors = ['red', '#f57900', 'yellow', '#ce5c00', '#5c3566'];
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const arc = 100;
    const size = 7;
    const parts = [];
    for (let i = 0; i < arc; i++) {
      parts.push({
        x: Math.ceil(Math.random() * w),
        y: Math.ceil(Math.random() * h),
        toX: Math.random() * 5 - 1,
        toY: Math.random() * 2 - 1,
        c: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * size,
      });
    }
    return parts;
  }, []);

  const DistanceBetween = useCallback((p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const animate = useCallback(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = window.innerWidth;
    const h = window.innerHeight;
    const parts = partsRef.current;
    const speed = 20;

    let time = 0;

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const li = parts[i];
        const distanceFactor = Math.max(
          Math.min(15 - DistanceBetween(mouse, li) / 10, 10),
          1
        );

        ctx.beginPath();
        ctx.arc(li.x, li.y, li.size * distanceFactor, 0, Math.PI * 2, false);
        ctx.fillStyle = li.c;
        ctx.strokeStyle = li.c;

        if (i % 2 === 0) ctx.stroke();
        else ctx.fill();

        li.x += li.toX * (time * 0.05);
        li.y += li.toY * (time * 0.05);

        // Wrap particles around the canvas edges
        if (li.x > w) li.x = 0;
        if (li.y > h) li.y = 0;
        if (li.x < 0) li.x = w;
        if (li.y < 0) li.y = h;
      }

      if (time < speed) time++;
      animationRef.current = requestAnimationFrame(loop);
    };

    loop();
  }, [DistanceBetween, mouse, particlesRef]);

  useLayoutEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    partsRef.current = createParticles(canvas);
    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [createParticles, animate, particlesRef]);

  const handleMouseMove = useCallback((e) => {
    setMouse({ x: e.layerX, y: e.layerY });
  }, []);

  const handleResize = useCallback(() => {
    if (particlesRef.current) {
      const canvas = particlesRef.current;
      partsRef.current = createParticles(canvas);
    }
  }, [createParticles, particlesRef]);

  return {
    handleMouseMove,
    handleResize,
  };
};
