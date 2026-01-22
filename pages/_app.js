import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [showSplash, setShowSplash] = useState(true);
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    // Check if splash has been shown in this session
    const hasSeenSplash = sessionStorage.getItem('votesy_splash_shown');
    
    if (hasSeenSplash) {
      setShowSplash(false);
      setSplashComplete(true);
    } else {
      // Auto-hide splash after animation completes (3 seconds)
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('votesy_splash_shown', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleSplashComplete = () => {
    setSplashComplete(true);
  };

  return (
    <SessionProvider session={session}>
      <SplashScreen isVisible={showSplash} onComplete={handleSplashComplete} />
      <div style={{ 
        opacity: splashComplete ? 1 : 0, 
        transition: 'opacity 0.3s ease-in-out',
        visibility: splashComplete ? 'visible' : 'hidden'
      }}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
