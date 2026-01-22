import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, Sparkles, Shield, Zap, Users, Award, TrendingUp } from 'lucide-react';

export default function CandidateLogin() {
  const router = useRouter();
  const { error } = router.query;
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.role === 'candidate') {
        router.push('/candidate/dashboard');
      }
    });
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      isCandidate: 'true'
    });

    setLoading(false);

    if (res?.error) {
      setFormError('Invalid email or password');
    } else {
      window.location.href = '/candidate/dashboard';
    }
  }

  const getErrorMessage = () => {
    if (formError) return formError;
    if (error === 'CredentialsSignin') {
      return 'Invalid email or password';
    }
    if (error) return 'Authentication failed. Please try again.';
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <>
      <Head>
        <title>Candidate Sign In - Votesy</title>
      </Head>

      <div className="auth-page">
        {/* Left Side - Decorative */}
        <div className="auth-hero">
          <div className="auth-hero-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="auth-logo">
                <div className="auth-logo-icon">
                  <CheckCircle2 size={24} color="white" />
                </div>
                <span>Votesy</span>
              </Link>

              <h1 className="auth-hero-title">
                Candidate<br />
                <span className="text-gradient">Portal.</span>
              </h1>

              <p className="auth-hero-description">
                Manage your campaigns, connect with voters, and track your election performance in real-time.
              </p>

              <div className="auth-features">
                <div className="auth-feature">
                  <div className="auth-feature-icon">
                    <Award size={20} />
                  </div>
                  <div>
                    <strong>Campaign Management</strong>
                    <span>Create and manage voting campaigns</span>
                  </div>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                    <TrendingUp size={20} style={{ color: '#34d399' }} />
                  </div>
                  <div>
                    <strong>Real-time Analytics</strong>
                    <span>Track votes and engagement metrics</span>
                  </div>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                    <Shield size={20} style={{ color: '#22d3ee' }} />
                  </div>
                  <div>
                    <strong>Verified Identity</strong>
                    <span>Build trust with verified credentials</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Animated background elements */}
          <div className="auth-hero-bg">
            <div className="auth-orb auth-orb-1"></div>
            <div className="auth-orb auth-orb-2"></div>
            <div className="auth-orb auth-orb-3"></div>
            <div className="auth-grid"></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-container">
          <motion.div
            className="auth-form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="auth-form-header">
              <h2>Candidate Sign In</h2>
              <p>Access your campaign dashboard</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                className="auth-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errorMessage}
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label>Email address</label>
                <div className="auth-input-wrapper">
                  <Mail size={18} />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={18} />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* OAuth Divider */}
            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="auth-oauth-btn"
              onClick={async () => {
                setGoogleLoading(true);
                await signIn('google', { callbackUrl: '/candidate/complete-profile' });
              }}
              disabled={googleLoading || loading}
            >
              {googleLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link href="/candidate/signup">Create account</Link>
              </p>
            </div>

            <div className="auth-candidate-link">
              <Sparkles size={14} />
              <span>Are you a voter?</span>
              <Link href="/login">Sign in here</Link>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          background: var(--bg-primary);
        }
        
        .auth-hero {
          flex: 1;
          display: none;
          position: relative;
          background: linear-gradient(135deg, #0a1f1a 0%, #0f1f2a 100%);
          overflow: hidden;
          padding: 48px;
        }
        
        @media (min-width: 1024px) {
          .auth-hero {
            display: flex;
            align-items: center;
          }
        }
        
        .auth-hero-content {
          position: relative;
          z-index: 10;
          max-width: 520px;
        }
        
        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 22px;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          color: white;
          margin-bottom: 48px;
        }
        
        .auth-logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3);
        }
        
        .auth-hero-title {
          font-size: 56px;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: white;
          margin-bottom: 24px;
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #22c55e 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .auth-hero-description {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin-bottom: 48px;
        }
        
        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .auth-feature {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .auth-feature-icon {
          width: 48px;
          height: 48px;
          background: rgba(34, 197, 94, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4ade80;
        }
        
        .auth-feature strong {
          display: block;
          color: white;
          font-weight: 600;
          font-size: 15px;
        }
        
        .auth-feature span {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }
        
        .auth-hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        
        .auth-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: float 8s ease-in-out infinite;
        }
        
        .auth-orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%);
          top: -100px;
          right: -100px;
        }
        
        .auth-orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
          bottom: -50px;
          left: -50px;
          animation-delay: -3s;
        }
        
        .auth-orb-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -5s;
        }
        
        .auth-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%);
        }
        
        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          background: var(--bg-primary);
        }
        
        @media (min-width: 1024px) {
          .auth-form-container {
            max-width: 560px;
          }
        }
        
        .auth-form-wrapper {
          width: 100%;
          max-width: 400px;
        }
        
        .auth-form-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .auth-form-header h2 {
          font-size: 28px;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          color: var(--text-primary);
          margin-bottom: 8px;
        }
        
        .auth-form-header p {
          color: var(--text-tertiary);
          font-size: 15px;
        }
        
        .auth-error {
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          color: #fca5a5;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 14px;
          margin-bottom: 24px;
          text-align: center;
        }
        
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .auth-field label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        
        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .auth-input-wrapper > svg:first-child {
          position: absolute;
          left: 16px;
          color: var(--text-muted);
          pointer-events: none;
        }
        
        .auth-input-wrapper input {
          width: 100%;
          padding: 14px 48px 14px 48px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 15px;
          transition: all 0.2s ease;
        }
        
        .auth-input-wrapper input::placeholder {
          color: var(--text-muted);
        }
        
        .auth-input-wrapper input:focus {
          outline: none;
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
        }
        
        .auth-password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
          z-index: 2;
        }
        
        .auth-password-toggle svg {
          pointer-events: none;
        }
        
        .auth-password-toggle:hover {
          color: var(--text-primary);
        }
        
        .auth-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 16px 24px;
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }
        
        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
        }
        
        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .auth-footer {
          text-align: center;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
        }
        
        .auth-footer p {
          color: var(--text-tertiary);
          font-size: 14px;
        }
        
        .auth-footer a {
          color: #22c55e;
          font-weight: 600;
        }
        
        .auth-footer a:hover {
          color: #16a34a;
        }
        
        .auth-candidate-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
          padding: 12px;
          background: var(--surface-2);
          border-radius: 10px;
          font-size: 13px;
          color: var(--text-muted);
        }
        
        .auth-candidate-link svg {
          color: var(--brand-secondary);
        }
        
        .auth-candidate-link a {
          color: var(--brand-secondary);
          font-weight: 600;
        }
        
        .auth-divider {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 24px 0;
          color: var(--text-muted);
          font-size: 13px;
        }
        
        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-subtle);
        }
        
        .auth-divider span {
          padding: 0 16px;
        }
        
        .auth-oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 14px 24px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 16px;
        }
        
        .auth-oauth-btn:hover:not(:disabled) {
          background: var(--surface-2);
          border-color: var(--border-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .auth-oauth-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .auth-oauth-btn svg {
          flex-shrink: 0;
        }
        
        .auth-candidate-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
          padding: 12px;
          background: var(--surface-2);
          border-radius: 10px;
          font-size: 13px;
          color: var(--text-muted);
        }
        
        .auth-candidate-link svg {
          color: var(--brand-secondary);
        }
        
        .auth-candidate-link a {
          color: var(--brand-secondary);
          font-weight: 600;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}
