import { signIn, getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

export default function CandidateLogin() {
  const router = useRouter();
  const { error } = router.query;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

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

  return (
    <>
      <Head>
        <title>Candidate Login - VotePlatform</title>
      </Head>

      <div className="auth-container">
        <div className="auth-card">
          {/* Back Link */}
          <Link
            href="/login"
            style={{
              position: 'absolute',
              top: 24,
              left: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--text-tertiary)',
              fontSize: 13,
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
          >
            <ArrowLeft size={14} />
            Voter Login
          </Link>

          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: 32, paddingTop: 16 }}>
            <div style={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              boxShadow: '0 10px 40px rgba(139, 92, 246, 0.3)',
            }}>
              <Vote size={28} color="white" />
            </div>
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: 20,
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              color: '#a78bfa',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 16,
            }}>
              Candidate Portal
            </div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
              fontFamily: 'Space Grotesk, Sora, sans-serif',
            }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 15 }}>
              Sign in to manage your voting campaigns
            </p>
          </div>

          {/* Error Message */}
          {(error || formError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert-error"
              style={{ marginBottom: 24 }}
            >
              {formError || (error === 'CredentialsSignin' ? 'Invalid email or password' : error)}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Email address</label>
              <input
                name="email"
                type="email"
                required
                className="input"
                placeholder="you@company.com"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label className="input-label">Password</label>
              <div className="input-wrapper">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input"
                  placeholder="••••••••"
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-icon"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gradient"
              style={{ 
                marginBottom: 24,
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ marginRight: 8 }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text-tertiary)', marginBottom: 16 }}>
              Don't have an account?{' '}
              <Link
                href="/candidate/signup"
                style={{ color: '#a78bfa', fontWeight: 600 }}
              >
                Register as Candidate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
