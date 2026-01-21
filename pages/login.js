import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Vote, Mail, Lock, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

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
        <title>Sign In - VotePlatform</title>
      </Head>
      
      <div className="auth-container">
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Back Link */}
          <Link 
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'var(--text-tertiary)',
              marginBottom: 32,
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              style={{
                width: 56,
                height: 56,
                background: 'var(--gradient-brand)',
                borderRadius: 16,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <Vote size={26} color="white" />
            </motion.div>
            <h1 style={{ 
              fontSize: 26, 
              fontWeight: 700, 
              marginBottom: 8,
              letterSpacing: '-0.02em',
              fontFamily: 'Space Grotesk, Sora, sans-serif',
            }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 15 }}>
              Sign in to continue to VotePlatform
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <motion.div 
              className="alert-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {errorMessage}
            </motion.div>
          )}

          {/* OAuth Buttons */}
          <button 
            onClick={() => handleOAuthSignIn('google')} 
            className="btn-oauth"
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button 
            onClick={() => handleOAuthSignIn('linkedin')} 
            className="btn-oauth"
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Continue with LinkedIn
          </button>

          {/* Divider */}
          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">or</span>
            <div className="divider-line"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  name="email" 
                  type="email" 
                  required 
                  className="input-field"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>
            
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock size={18} className="input-icon" />
                <input 
                  name="password" 
                  type={showPassword ? 'text' : 'password'}
                  required 
                  className="input-field"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: 4,
                    color: 'var(--text-muted)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <Link 
                href="/forgot" 
                style={{ 
                  display: 'block',
                  textAlign: 'right',
                  marginTop: 10,
                  color: 'var(--text-tertiary)',
                  fontSize: 13,
                  fontWeight: 500,
                  transition: 'color var(--transition-fast)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-primary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
              >
                Forgot password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: 8 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p style={{ 
            textAlign: 'center', 
            marginTop: 32,
            paddingTop: 24,
            borderTop: '1px solid var(--border-subtle)',
            color: 'var(--text-tertiary)',
            fontSize: 14
          }}>
            Don't have an account?{' '}
            <Link 
              href="/signup" 
              style={{ 
                color: 'var(--brand-primary)', 
                fontWeight: 600,
                transition: 'color var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--brand-primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--brand-primary)'}
            >
              Create account
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
