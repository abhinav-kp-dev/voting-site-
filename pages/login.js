import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, Sparkles, Shield, Zap, Users } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const { error } = router.query;
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getSession().then(session => {
      if (session) router.push('/');
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
      password 
    });
    
    setLoading(false);
    
    if (res?.error) {
      setFormError('Invalid email or password');
    } else {
      window.location.href = '/';
    }
  }

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    await signIn(provider, { callbackUrl: '/' });
  };

  const getErrorMessage = () => {
    if (formError) return formError;
    if (error === 'OAuthAccountNotLinked') {
      return 'This email is already associated with another sign-in method';
    }
    if (error) return 'Authentication failed. Please try again.';
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <>
      <Head>
        <title>Sign In - Votesy</title>
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
                Your voice,<br />
                <span className="text-gradient">amplified.</span>
              </h1>
              
              <p className="auth-hero-description">
                Join thousands of organizations using Votesy to make decisions that matter.
              </p>
              
              <div className="auth-features">
                <div className="auth-feature">
                  <div className="auth-feature-icon">
                    <Shield size={20} />
                  </div>
                  <div>
                    <strong>Enterprise Security</strong>
                    <span>End-to-end encrypted voting</span>
                  </div>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                    <Zap size={20} style={{ color: '#34d399' }} />
                  </div>
                  <div>
                    <strong>Real-time Results</strong>
                    <span>Live vote tracking & analytics</span>
                  </div>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                    <Users size={20} style={{ color: '#22d3ee' }} />
                  </div>
                  <div>
                    <strong>LinkedIn Verified</strong>
                    <span>Professional identity verification</span>
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
              <h2>Welcome back</h2>
              <p>Sign in to your account to continue</p>
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

            {/* OAuth Buttons */}
            <div className="auth-oauth-grid">
              <button 
                onClick={() => handleOAuthSignIn('google')} 
                className="auth-oauth-btn"
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>

              <button 
                onClick={() => handleOAuthSignIn('linkedin')} 
                className="auth-oauth-btn"
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LinkedIn</span>
              </button>
            </div>

            {/* Divider */}
            <div className="auth-divider">
              <div className="auth-divider-line"></div>
              <span>or continue with email</span>
              <div className="auth-divider-line"></div>
            </div>

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
                <div className="auth-forgot-wrapper">
                  <Link href="/forgot" className="auth-forgot-link">
                    Forgot password?
                  </Link>
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

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link href="/signup">Create account</Link>
              </p>
            </div>
            
            <div className="auth-candidate-link">
              <Sparkles size={14} />
              <span>Are you a candidate?</span>
              <Link href="/candidate/login">Sign in here</Link>
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
        
        .auth-oauth-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }
        
        .auth-oauth-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 20px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .auth-oauth-btn:hover:not(:disabled) {
          background: var(--bg-hover);
          border-color: var(--border-strong);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .auth-oauth-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .auth-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: var(--border-subtle);
        }
        
        .auth-divider span {
          font-size: 13px;
          color: var(--text-muted);
          white-space: nowrap;
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
        
        .auth-field-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .auth-forgot-wrapper {
          text-align: right;
          margin-top: 8px;
        }
        
        .auth-forgot-link {
          font-size: 13px;
          color: #22c55e;
          font-weight: 500;
        }
        
        .auth-forgot-link:hover {
          color: #16a34a;
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
      `}</style>
    </>
  );
}
