import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, Eye, EyeOff, ArrowLeft, Loader2, Check, Building, Linkedin } from 'lucide-react';

export default function CandidateSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSession().then(session => {
      if (session?.user?.role === 'candidate') {
        router.push('/candidate/dashboard');
      }
    });
  }, [router]);

  async function handle(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const linkedin = e.target.linkedin.value;
    const organization = e.target.organization.value;

    const res = await fetch('/api/auth/candidate-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, linkedin, organization })
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setError(data.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/candidate/login'), 2000);
  }

  return (
    <>
      <Head>
        <title>Candidate Registration - VotePlatform</title>
      </Head>

      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: 480 }}>
          {/* Back Link */}
          <Link
            href="/candidate/login"
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
            Back to Login
          </Link>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '40px 0' }}
            >
              <div style={{
                width: 80,
                height: 80,
                background: 'var(--success-bg)',
                borderRadius: 20,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}>
                <Check size={40} style={{ color: 'var(--success)' }} />
              </div>
              <h2 style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 8,
                fontFamily: 'Space Grotesk, Sora, sans-serif',
              }}>
                Registration Successful!
              </h2>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: 24 }}>
                Redirecting to login...
              </p>
              <div className="progress-bar" style={{ maxWidth: 200, margin: '0 auto' }}>
                <motion.div
                  className="progress-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                />
              </div>
            </motion.div>
          ) : (
            <>
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
                  Create Candidate Profile
                </h1>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 15 }}>
                  Register to create and manage voting campaigns
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="alert-error"
                  style={{ marginBottom: 24 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handle}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: 16,
                  marginBottom: 20,
                }}>
                  <div>
                    <label className="input-label">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="input-label">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="input"
                      placeholder="email@company.com"
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="input-label">Password</label>
                  <div className="input-wrapper">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      className="input"
                      placeholder="Min. 6 characters"
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

                <div style={{ marginBottom: 20 }}>
                  <label className="input-label">
                    <Building size={14} style={{ marginRight: 6 }} />
                    Organization
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>(Optional)</span>
                  </label>
                  <input
                    name="organization"
                    type="text"
                    className="input"
                    placeholder="Your Company Inc."
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label className="input-label">
                    <Linkedin size={14} style={{ marginRight: 6 }} />
                    LinkedIn Profile
                    <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>(Optional)</span>
                  </label>
                  <input
                    name="linkedin"
                    type="url"
                    className="input"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
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
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
                  Already have an account?{' '}
                  <Link
                    href="/candidate/login"
                    style={{ color: '#a78bfa', fontWeight: 600 }}
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
