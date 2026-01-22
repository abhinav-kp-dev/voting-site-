import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Plus,
  LogOut,
  Users,
  BarChart3,
  ExternalLink,
  Pencil,
  Trash2,
  Loader2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Calendar
} from 'lucide-react';

export default function CandidateDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/candidate/login');
    } else if (status === 'authenticated') {
      // Check if user has LinkedIn profile (required for candidates)
      if (!session?.user?.linkedin) {
        router.push('/candidate/complete-profile');
      } else {
        fetchTeams();
      }
    }
  }, [status, router, session]);

  async function fetchTeams() {
    const res = await fetch('/api/candidate/teams');
    const data = await res.json();
    setTeams(data.teams || []);
    setLoading(false);
  }

  async function deleteTeam(slug) {
    if (!confirm('Are you sure you want to delete this team? This action cannot be undone.')) return;
    await fetch(`/api/candidate/teams/${slug}`, { method: 'DELETE' });
    fetchTeams();
  }

  const getTotalVotes = () => {
    return teams.reduce((acc, team) => acc + (team.voteCount || 0), 0);
  };

  const getTotalCandidates = () => {
    return teams.reduce((acc, team) => acc + (team.candidates?.length || 0), 0);
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Head>
          <title>Dashboard - Votesy</title>
        </Head>
        <div className="loading-container" style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
          <div className="loading-spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Candidate Dashboard - Votesy</title>
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {/* Header */}
        <header className="navbar">
          <div className="navbar-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Link href="/" className="navbar-brand">
                <div className="navbar-logo">
                  <CheckCircle2 size={18} color="white" />
                </div>
                <span>Votesy</span>
              </Link>
              <span className="badge badge-primary" style={{ marginLeft: 4 }}>
                Candidate
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
                {session?.user?.name || session?.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-ghost"
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <LogOut size={16} />
                <span style={{ display: 'none' }} className="sm-show">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
          {/* Page Header */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 40,
            flexWrap: 'wrap',
            gap: 20,
          }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 style={{
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 8,
                fontFamily: 'Space Grotesk, Sora, sans-serif',
              }}>
                Dashboard
              </h1>
              <p style={{ color: 'var(--text-tertiary)', fontSize: 15 }}>
                Manage your voting campaigns and track results
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push('/candidate/create-team')}
              className="btn-gradient"
              style={{
                width: 'auto',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Plus size={18} />
              Create Campaign
            </motion.button>
          </div>

          {/* Stats Cards */}
          {teams.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 20,
                marginBottom: 40,
              }}
            >
              <div className="stat-card">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(34, 197, 94, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--brand-primary)' }} />
                  </div>
                </div>
                <div className="stat-value">{teams.length}</div>
                <div className="stat-label">Total Campaigns</div>
              </div>

              <div className="stat-card">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--success-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <TrendingUp size={20} style={{ color: 'var(--success)' }} />
                  </div>
                </div>
                <div className="stat-value">{getTotalVotes()}</div>
                <div className="stat-label">Total Votes</div>
              </div>

              <div className="stat-card">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(6, 182, 212, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Users size={20} style={{ color: 'var(--brand-accent)' }} />
                  </div>
                </div>
                <div className="stat-value">{getTotalCandidates()}</div>
                <div className="stat-label">Total Candidates</div>
              </div>
            </motion.div>
          )}

          {/* Teams Grid */}
          {teams.length > 0 ? (
            <div className="team-grid">
              {teams.map((team, index) => (
                <motion.div
                  key={team.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 24,
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{
                      fontSize: 18,
                      fontWeight: 700,
                      marginBottom: 4,
                      fontFamily: 'Space Grotesk, Sora, sans-serif',
                    }}>
                      {team.name}
                    </h3>
                    <p style={{
                      fontSize: 13,
                      color: 'var(--text-muted)',
                      fontFamily: 'monospace',
                    }}>
                      /team/{team.slug}
                    </p>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: 24,
                    marginBottom: 20,
                    paddingBottom: 20,
                    borderBottom: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(6, 182, 212, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Users size={18} style={{ color: 'var(--brand-accent)' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>
                          {team.candidates?.length || 0}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Candidates
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(6, 182, 212, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <BarChart3 size={18} style={{ color: 'var(--brand-accent)' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>
                          {team.voteCount || 0}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Votes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link
                      href={`/candidate/edit-team/${team.slug}`}
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        fontSize: 13,
                      }}
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>
                    <Link
                      href={`/team/${team.slug}`}
                      target="_blank"
                      className="btn-primary"
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        fontSize: 13,
                      }}
                    >
                      <ExternalLink size={14} />
                      View
                    </Link>
                    <button
                      onClick={() => deleteTeam(team.slug)}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--error-bg)',
                        border: '1px solid var(--error-border)',
                        borderRadius: 'var(--radius-md)',
                        color: '#fca5a5',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--error-bg)';
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="empty-state"
              style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="empty-state-icon">
                <Sparkles size={32} />
              </div>
              <h3 className="empty-state-title">No campaigns yet</h3>
              <p className="empty-state-description">
                Create your first voting campaign to start collecting votes from your community.
              </p>
              <button
                onClick={() => router.push('/candidate/create-team')}
                className="btn-gradient"
                style={{
                  width: 'auto',
                  padding: '12px 24px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Plus size={18} />
                Create Your First Campaign
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
}
