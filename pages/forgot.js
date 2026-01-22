import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { KeyRound, Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function Forgot() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const email = e.target.email.value;
    
    await fetch('/api/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    setLoading(false);
    setSent(true);
  }

  return (
    <>
      <Head>
        <title>Forgot Password - Votesy</title>
      </Head>

      <div className="auth-container">
        <div className="auth-card">
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 56,
              height: 56,
              background: sent 
                ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: 16,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              boxShadow: sent 
                ? '0 10px 40px rgba(34, 197, 94, 0.3)'
                : '0 10px 40px rgba(34, 197, 94, 0.3)'
            }}>
              {sent ? (
                <CheckCircle size={28} color="white" />
              ) : (
                <KeyRound size={28} color="white" />
              )}
            </div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 8,
              letterSpacing: '-0.02em'
            }}>
              {sent ? 'Check your email' : 'Forgot Password'}
            </h1>
            <p style={{ color: '#a3a3a3', fontSize: 15 }}>
              {sent 
                ? 'We sent you a password reset link'
                : 'Enter your email to reset your password'
              }
            </p>
          </div>

          {sent ? (
            <>
              <div className="alert-success" style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: 8 }}>
                  Password reset instructions have been sent to your email.
                </p>
                <p style={{ fontSize: 13, opacity: 0.8 }}>
                  Check your inbox and spam folder.
                </p>
              </div>

              <p style={{
                fontSize: 12,
                color: '#737373',
                textAlign: 'center',
                marginTop: 16,
                padding: 12,
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <strong>Dev Note:</strong> Check server console for the reset link if email isn't configured.
              </p>

              <Link
                href="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginTop: 24,
                  color: '#a3a3a3',
                  fontSize: 14,
                  textDecoration: 'none'
                }}
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="input-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail
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
                      name="email"
                      type="email"
                      required
                      className="input-field"
                      style={{ paddingLeft: 44 }}
                      placeholder="you@example.com"
                    />
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
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
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
            </>
          )}
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
