import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ isVisible, onComplete }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onAnimationComplete={(definition) => {
            if (definition.opacity === 0) {
              onComplete?.();
            }
          }}
        >
          {/* Animated Background */}
          <div className="splash-bg">
            <div className="splash-orb splash-orb-1"></div>
            <div className="splash-orb splash-orb-2"></div>
            <div className="splash-orb splash-orb-3"></div>
            <div className="splash-grid"></div>
          </div>

          {/* Content */}
          <div className="splash-content">
            {/* Brand Name */}
            <motion.div
              className="splash-brand"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="splash-title">
                <span className="splash-letter">V</span>
                <span className="splash-letter">o</span>
                <span className="splash-letter">t</span>
                <span className="splash-letter">e</span>
                <span className="splash-letter">s</span>
                <span className="splash-letter">y</span>
              </h1>
              <motion.p
                className="splash-tagline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Your voice, amplified.
              </motion.p>
            </motion.div>

            {/* Loading Bar */}
            <motion.div
              className="splash-loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <div className="splash-loader-track">
                <motion.div
                  className="splash-loader-bar"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 1.1, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </div>

          <style jsx global>{`
            .splash-screen {
              position: fixed;
              inset: 0;
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #09090b;
              overflow: hidden;
            }

            .splash-bg {
              position: absolute;
              inset: 0;
              pointer-events: none;
            }

            .splash-orb {
              position: absolute;
              border-radius: 50%;
              filter: blur(100px);
            }

            .splash-orb-1 {
              width: 600px;
              height: 600px;
              background: radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%);
              top: -200px;
              right: -200px;
              animation: splashFloat 4s ease-in-out infinite;
            }

            .splash-orb-2 {
              width: 500px;
              height: 500px;
              background: radial-gradient(circle, rgba(6, 182, 212, 0.35) 0%, transparent 70%);
              bottom: -150px;
              left: -150px;
              animation: splashFloat 4s ease-in-out infinite;
              animation-delay: -2s;
            }

            .splash-orb-3 {
              width: 400px;
              height: 400px;
              background: radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%);
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              animation: splashPulse 3s ease-in-out infinite;
            }

            .splash-grid {
              position: absolute;
              inset: 0;
              background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
              background-size: 80px 80px;
              mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 70%);
            }

            .splash-content {
              position: relative;
              z-index: 10;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 32px;
            }

            .splash-brand {
              text-align: center;
            }

            .splash-title {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 72px;
              font-weight: 700;
              letter-spacing: -0.04em;
              color: white;
              margin: 0;
              display: flex;
              gap: 2px;
            }

            .splash-letter {
              display: inline-block;
              animation: splashLetterReveal 0.5s ease-out forwards;
              opacity: 0;
              transform: translateY(20px);
            }

            .splash-letter:nth-child(1) { animation-delay: 0.3s; }
            .splash-letter:nth-child(2) { animation-delay: 0.4s; }
            .splash-letter:nth-child(3) { animation-delay: 0.5s; }
            .splash-letter:nth-child(4) { animation-delay: 0.6s; }
            .splash-letter:nth-child(5) { animation-delay: 0.7s; }
            .splash-letter:nth-child(6) { animation-delay: 0.8s; }

            .splash-tagline {
              font-family: 'Outfit', sans-serif;
              font-size: 18px;
              color: rgba(255, 255, 255, 0.6);
              margin: 12px 0 0 0;
              letter-spacing: 0.05em;
            }

            .splash-loader {
              width: 200px;
            }

            .splash-loader-track {
              width: 100%;
              height: 4px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 2px;
              overflow: hidden;
            }

            .splash-loader-bar {
              height: 100%;
              background: linear-gradient(90deg, #22c55e, #06b6d4, #22c55e);
              background-size: 200% 100%;
              border-radius: 2px;
              animation: splashLoaderShimmer 1s linear infinite;
            }

            @keyframes splashFloat {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-30px) scale(1.05); }
            }

            @keyframes splashPulse {
              0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
            }

            @keyframes splashLetterReveal {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
            }

            @keyframes splashLoaderShimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }

            @media (max-width: 640px) {
              .splash-title {
                font-size: 48px;
              }

              .splash-tagline {
                font-size: 14px;
              }

              .splash-loader {
                width: 160px;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
