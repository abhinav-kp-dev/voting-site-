import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Linkedin, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  LogOut, 
  Loader2,
  ExternalLink,
  Edit2,
  Check,
  X,
  Calendar,
  Award
} from 'lucide-react';

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [votingHistory, setVotingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [editingLinkedin, setEditingLinkedin] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchVotingHistory();
      fetchUserProfile();
    }
  }, [status]);

  async function fetchVotingHistory() {
    try {
      const res = await fetch('/api/user/voting-history');
      const data = await res.json();
      setVotingHistory(data.votes || []);
    } catch (err) {
      console.error('Failed to fetch voting history');
    }
    setLoading(false);
  }

  async function fetchUserProfile() {
    try {
      const res = await fetch('/api/user/profile');
      const data = await res.json();
      setLinkedinUrl(data.linkedin || '');
    } catch (err) {
      console.error('Failed to fetch profile');
    }
  }

  async function updateLinkedin(e) {
    e.preventDefault();
    if (linkedinUrl && !linkedinUrl.includes('linkedin.com')) {
      alert('Please enter a valid LinkedIn URL');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedin: linkedinUrl })
      });
      const data = await res.json();
      if (data.ok) {
        setEditingLinkedin(false);
      }
    } catch (err) {
      alert('Failed to update LinkedIn');
    }
    setSaving(false);
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <Head>
          <title>Profile - Votesy</title>
        </Head>
        <div className="loading-container" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
          <div className="loading-spinner"></div>
        </div>
      </>
    );
  }

  if (!session) return null;

  return (
    <>
      <Head>
        <title>Profile - Votesy</title>
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {/* Header */}
        <header className="navbar">
          <div className="navbar-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Link
                href="/"
                className="btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <ArrowLeft size={16} />
                <span>Back to Home</span>
              </Link>
            </div>
            
            <Link href="/" className="navbar-brand">
              <div className="navbar-logo">
                <CheckCircle2 size={18} color="white" />
              </div>
              <span>Votesy</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="container" style={{ maxWidth: 800, paddingTop: 40, paddingBottom: 80 }}>
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
            style={{ padding: 32, marginBottom: 24 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              {/* Avatar */}
              {session.user.image ? (
                <img 
                  src={session.user.image} 
                  alt="" 
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 'var(--radius-xl)',
                    border: '3px solid var(--border-subtle)',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{
                  width: 100,
                  height: 100,
                  borderRadius: 'var(--radius-xl)',
                  background: 'var(--gradient-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 40,
                  fontWeight: 700,
                  color: 'white',
                  fontFamily: 'Space Grotesk, Sora, sans-serif',
                }}>
                  {(session.user.name || session.user.email || '?').charAt(0).toUpperCase()}
                </div>
              )}

              {/* Info */}
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ 
                  fontSize: 28, 
                  fontWeight: 700, 
                  marginBottom: 8,
                  fontFamily: 'Space Grotesk, Sora, sans-serif',
                }}>
                  {session.user.name || 'User'}
                </h1>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 8, 
                  color: 'var(--text-tertiary)',
                  fontSize: 14,
                }}>
                  <Mail size={14} />
                  <span>{session.user.email}</span>
                </div>
              </div>

              {/* LinkedIn Section */}
              <div style={{ 
                width: '100%',
                paddingTop: 24,
                borderTop: '1px solid var(--border-subtle)',
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8, 
                  fontSize: 13, 
                  color: 'var(--text-muted)',
                  marginBottom: 12,
                }}>
                  <Linkedin size={14} />
                  <span>LinkedIn Profile</span>
                </div>
                
                {editingLinkedin ? (
                  <form onSubmit={updateLinkedin} style={{ display: 'flex', gap: 12 }}>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/your-profile"
                      className="input"
                      style={{ flex: 1 }}
                      autoFocus
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary"
                      style={{ padding: '12px 16px' }}
                    >
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingLinkedin(false)}
                      className="btn-secondary"
                      style={{ padding: '12px 16px' }}
                    >
                      <X size={16} />
                    </button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {linkedinUrl ? (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 8, 
                          color: '#0077b5',
                          fontSize: 14,
                        }}
                      >
                        {linkedinUrl.replace('https://', '').replace('www.', '')}
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>Not linked</span>
                    )}
                    <button
                      onClick={() => setEditingLinkedin(true)}
                      className="btn-ghost"
                      style={{ 
                        padding: '6px 12px', 
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Edit2 size={12} />
                      {linkedinUrl ? 'Edit' : 'Add'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Voting History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
            style={{ padding: 32 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(6, 182, 212, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Clock size={22} style={{ color: 'var(--brand-accent)' }} />
              </div>
              <div>
                <h2 style={{ 
                  fontSize: 20, 
                  fontWeight: 700,
                  fontFamily: 'Space Grotesk, Sora, sans-serif',
                  marginBottom: 4,
                }}>
                  Voting History
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
                  Your past votes
                </p>
              </div>
            </div>

            {votingHistory.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {votingHistory.map((vote) => (
                  <div
                    key={vote._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 20,
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      transition: 'border-color var(--transition-fast)',
                    }}
                  >
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8,
                        marginBottom: 6,
                      }}>
                        <Award size={16} style={{ color: 'var(--brand-accent)' }} />
                        <span style={{ fontWeight: 600 }}>
                          Voted for: <span style={{ color: 'var(--brand-accent)' }}>{vote.candidateName || vote.candidateId}</span>
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                        Team: {vote.teamName || vote.teamSlug}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        fontSize: 12, 
                        color: 'var(--text-muted)',
                        marginBottom: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}>
                        <Calendar size={12} />
                        {new Date(vote.votedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <Link
                        href={`/team/${vote.teamSlug}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 13,
                          color: 'var(--brand-accent)',
                          fontWeight: 500,
                        }}
                      >
                        View Team <ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '48px 24px' }}>
                <div className="empty-state-icon">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="empty-state-title">No votes yet</h3>
                <p className="empty-state-description">
                  You haven't voted in any elections yet. Browse available teams to cast your vote.
                </p>
                <Link href="/" className="btn-gradient" style={{ width: 'auto', padding: '12px 24px' }}>
                  Browse Teams
                </Link>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </>
  );
}
