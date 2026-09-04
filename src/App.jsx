import { useState, useEffect } from 'react';
import Flowers from './components/Flowers';
import FirefliesCanvas from './components/FirefliesCanvas';
import './style.scss';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
      document.body.classList.remove('not-loaded');
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`app-viewport ${!loaded ? 'not-loaded' : ''}`}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 100%, #290d1f 0%, #150610 50%, #080106 100%)',
      }}
    >
      {/* Interactive Fireflies & Star Canvas (Sakura Glow) */}
      <FirefliesCanvas themeColor="#ff7675" />

      {/* Atmospheric Glowing Nebula */}
      <div className="ambient-nebula" />

      {/* Bioluminescent Ground Mist */}
      <div className="ground-fog" />

      {/* Flowers - Full Screen, No Tilt */}
      <div className="flowers-parallax-wrapper">
        <Flowers />
      </div>
    </div>
  );
}
