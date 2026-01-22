import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { CheckCircle2, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ children, title = 'Votesy' }) {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Professional voting platform - Cast your vote securely" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        {/* Navigation */}
        <nav
          className="navbar"
          style={{
            background: scrolled ? 'rgba(9, 9, 11, 0.95)' : 'rgba(9, 9, 11, 0.8)',
            boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
          }}
        >
          <div className="navbar-inner">
            {/* Logo */}
            <Link href="/" className="navbar-brand">
              <span>Votesy</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="navbar-links" style={{ display: 'flex' }}>
              <Link href="/" className="navbar-link">
                Home
              </Link>

              {session ? (
                <>
                  {session.user.role === 'candidate' && (
                    <Link href="/candidate/dashboard" className="navbar-link">
                      Dashboard
                    </Link>
                  )}

                  {/* User Menu */}
                  <div style={{ position: 'relative', marginLeft: 8 }}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '6px 12px 6px 6px',
                        background: 'var(--surface-1)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-default)';
                        e.currentTarget.style.background = 'var(--surface-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (!userMenuOpen) {
                          e.currentTarget.style.borderColor = 'var(--border-subtle)';
                          e.currentTarget.style.background = 'var(--surface-1)';
                        }
                      }}
                    >
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'var(--gradient-brand)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'white',
                      }}>
                        {getInitials(session.user.name)}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>
                        {session.user.name?.split(' ')[0] || 'Account'}
                      </span>
                      <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <>
                          <div
                            style={{ position: 'fixed', inset: 0, zIndex: 40 }}
                            onClick={() => setUserMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 8px)',
                              right: 0,
                              minWidth: 200,
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-lg)',
                              boxShadow: 'var(--shadow-xl)',
                              overflow: 'hidden',
                              zIndex: 50,
                            }}
                          >
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                                {session.user.name}
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>
                                {session.user.email}
                              </div>
                            </div>

                            <div style={{ padding: 8 }}>
                              <Link
                                href="/profile"
                                onClick={() => setUserMenuOpen(false)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  padding: '10px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: 14,
                                  color: 'var(--text-secondary)',
                                  transition: 'all var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--surface-hover)';
                                  e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                              >
                                <User size={16} />
                                Profile
                              </Link>

                              <button
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  signOut({ callbackUrl: '/' });
                                }}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                  padding: '10px 12px',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: 14,
                                  color: 'var(--text-secondary)',
                                  textAlign: 'left',
                                  transition: 'all var(--transition-fast)',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'var(--error-bg)';
                                  e.currentTarget.style.color = '#fca5a5';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                              >
                                <LogOut size={16} />
                                Sign Out
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/candidate/signup" className="navbar-link">
                    Candidate Register
                  </Link>
                  <Link href="/login" className="navbar-link">
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    style={{
                      marginLeft: 8,
                      padding: '8px 20px',
                      background: 'var(--text-primary)',
                      color: 'var(--bg-primary)',
                      fontWeight: 600,
                      fontSize: 14,
                      borderRadius: 'var(--radius-md)',
                      transition: 'all var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--text-secondary)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--text-primary)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              style={{
                display: 'none',
                padding: 8,
                color: 'var(--text-primary)',
              }}
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                }}
              >
                <div style={{ padding: 16 }}>
                  {session ? (
                    <>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: 12,
                        marginBottom: 8,
                        background: 'var(--surface-1)',
                        borderRadius: 'var(--radius-md)',
                      }}>
                        <div style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'var(--gradient-brand)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'white',
                        }}>
                          {getInitials(session.user.name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{session.user.name}</div>
                          <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{session.user.email}</div>
                        </div>
                      </div>

                      <Link
                        href="/"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          fontSize: 15,
                          color: 'var(--text-secondary)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        Home
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          fontSize: 15,
                          color: 'var(--text-secondary)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        Profile
                      </Link>
                      {session.user.role === 'candidate' && (
                        <Link
                          href="/candidate/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            display: 'block',
                            padding: '12px 16px',
                            fontSize: 15,
                            color: 'var(--text-secondary)',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setMobileMenuOpen(false);
                        }}
                        style={{
                          width: '100%',
                          marginTop: 8,
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 15,
                          color: '#fca5a5',
                          borderRadius: 'var(--radius-sm)',
                          textAlign: 'left',
                        }}
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/candidate/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          fontSize: 15,
                          color: 'var(--text-secondary)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        Candidate Register
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'block',
                          padding: '12px 16px',
                          fontSize: 15,
                          color: 'var(--text-secondary)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'block',
                          marginTop: 8,
                          padding: '12px 16px',
                          fontSize: 15,
                          fontWeight: 600,
                          color: 'var(--bg-primary)',
                          background: 'var(--text-primary)',
                          borderRadius: 'var(--radius-md)',
                          textAlign: 'center',
                        }}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-brand">
              <span>Votesy</span>
            </div>
            <p className="footer-text">
              © {new Date().getFullYear()} Votesy. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .navbar-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
