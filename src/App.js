import React, { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;
    const rate = 60;
    const arc = 100;
    let time = 0;
    let count = 0;
    const size = 7;
    const speed = 20;
    const parts = [];
    const colors = ['red', '#f57900', 'yellow', '#ce5c00', '#5c3566'];
    const mouse = { x: 0, y: 0 };

    // Set canvas dimensions
    canvas.width = w;
    canvas.height = h;

    function create() {
      for (let i = 0; i < arc; i++) {
        parts[i] = {
          x: Math.ceil(Math.random() * w),
          y: Math.ceil(Math.random() * h),
          toX: Math.random() * 5 - 1,
          toY: Math.random() * 2 - 1,
          c: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * size,
        };
      }
    }

    function particles() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < arc; i++) {
        const li = parts[i];
        const distanceFactor = Math.max(Math.min(15 - DistanceBetween(mouse, li) / 10, 10), 1);

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
      setTimeout(particles, 1000 / rate);
    }

    function DistanceBetween(p1, p2) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function handleMouseMove(e) {
      mouse.x = e.layerX;
      mouse.y = e.layerY;
    }

    // Initialize the particles and mouse events
    create();
    particles();
    canvas.addEventListener('mousemove', handleMouseMove);

    // Handle window resizing
    function handleResize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      create();
    }
    window.addEventListener('resize', handleResize);

    // Cleanup event listeners on unmount
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} id="test"></canvas>
      <div className="container" id="container">
        <div className="content">
          <h1>Registruokis</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
