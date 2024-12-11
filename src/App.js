import React, { useLayoutEffect, useRef } from 'react';
import './App.css';
import Home from './components/Home/Home';
import { useParticles } from '../src/components/utils/particleUtils';

function App() {
  const particlesRef = useRef(null);
  const { handleMouseMove, handleResize, particles } = useParticles(particlesRef);

  useLayoutEffect(() => {
    const canvas = particlesRef.current;
    
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Initial particles setup
    particles();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [particlesRef, handleMouseMove, handleResize, particles]);

  return (
    <div className="App">
      <canvas id="test" ref={particlesRef}></canvas>
      <div className="container" id="container">
        <div className="content">
          <Home />
        </div>
      </div>
    </div>
  );
}

export default App;