import { useEffect, useState, useRef } from 'react';

export default function CursorGlow({ containerRef }) {
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const animationRef = useRef(null);
  const particleIdRef = useRef(0);

  // Smooth lerp animation for the main glow
  useEffect(() => {
    const animate = () => {
      setSmoothPosition(prev => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.15,
        y: prev.y + (targetPosition.y - prev.y) * 0.15,
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetPosition]);

  // Mouse tracking
  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setTargetPosition({ x, y });
        setIsVisible(true);

        // Spawn particles occasionally
        if (Math.random() > 0.7) {
          const newParticle = {
            id: particleIdRef.current++,
            x,
            y,
            size: Math.random() * 8 + 4,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2 - 1,
            life: 1,
            color: Math.random() > 0.5 ? 'rgba(34, 197, 94,' : 'rgba(6, 182, 212,',
          };
          setParticles(prev => [...prev.slice(-15), newParticle]);
        }
      } else {
        setIsVisible(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [containerRef]);

  // Particle animation
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.speedX,
            y: p.y + p.speedY,
            life: p.life - 0.03,
          }))
          .filter(p => p.life > 0)
      );
    }, 30);

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <>
      {/* Main glow */}
      <div
        style={{
          position: 'absolute',
          left: smoothPosition.x,
          top: smoothPosition.y,
          width: 500,
          height: 500,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.12) 0%, rgba(6, 182, 212, 0.06) 40%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
          zIndex: 1,
        }}
      />

      {/* Pulsing inner glow */}
      <div
        style={{
          position: 'absolute',
          left: smoothPosition.x,
          top: smoothPosition.y,
          width: 200,
          height: 200,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
          animation: isVisible ? 'cursorPulse 2s ease-in-out infinite' : 'none',
          zIndex: 2,
        }}
      />

      {/* Rotating ring */}
      <div
        style={{
          position: 'absolute',
          left: smoothPosition.x,
          top: smoothPosition.y,
          width: 120,
          height: 120,
          transform: 'translate(-50%, -50%)',
          border: '1px solid rgba(34, 197, 94, 0.15)',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
          animation: isVisible ? 'cursorRotate 8s linear infinite' : 'none',
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -3,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 6,
            height: 6,
            background: 'rgba(34, 197, 94, 0.6)',
            borderRadius: '50%',
          }}
        />
      </div>

      {/* Particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            transform: 'translate(-50%, -50%)',
            background: `${particle.color} ${particle.life})`,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
      ))}

      <style jsx global>{`
        @keyframes cursorPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.4;
          }
        }

        @keyframes cursorRotate {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
