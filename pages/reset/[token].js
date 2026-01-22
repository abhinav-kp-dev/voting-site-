import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Lock, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Reset() {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    
    const data = await res.json();
    setLoading(false);

    if (data.error) {
      setError(data.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/login'), 3000);
  }

  if (success) {
    return (
      <>
        <Head>
          <title>Password Reset - Votesy</title>
        </Head>
        <div className="auth-container">
          <div className="auth-card" style={{ textAlign: 'center' }}>
            <div style={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: 20,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              boxShadow: '0 10px 40px rgba(34, 197, 94, 0.3)'
            }}>
              <CheckCircle size={32} color="white" />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              Password Reset!
            </h1>
            <p style={{ color: '#a3a3a3', fontSize: 15, marginBottom: 24 }}>
              Redirecting to login...
            </p>
            <div style={{
              width: 40,
              height: 4,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              margin: '0 auto',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                animation: 'progress 3s ease-out forwards'
              }} />
            </div>
          </div>
        </div>
        <style jsx>{`
          @keyframes progress {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Reset Password - Votesy</title>
      </Head>

      <div className="auth-container">
        <div className="auth-card">
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              boxShadow: '0 10px 40px rgba(34, 197, 94, 0.3)'
            }}>
              <ShieldCheck size={28} color="white" />
            </div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
              letterSpacing: '-0.02em'
            }}>
              Reset Password
            </h1>
            <p style={{ color: '#a3a3a3', fontSize: 15 }}>
              Enter your new password below
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">New Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#737373'
                  }}
                />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="input-field"
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#737373',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#737373'
                  }}
                />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="input-field"
                  style={{ paddingLeft: 44, paddingRight: 44 }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#737373',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: 8 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <Link
            href="/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginTop: 24,
              color: '#737373',
              fontSize: 14,
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
