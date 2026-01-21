import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Linkedin, Loader2, Calendar, FileText, Vote, User } from 'lucide-react';

export default function CreateTeam() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamSlug, setTeamSlug] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [votingDeadline, setVotingDeadline] = useState('');
  const [candidates, setCandidates] = useState([
    { id: '1', name: '', bio: '', linkedin: '' },
    { id: '2', name: '', bio: '', linkedin: '' }
  ]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/candidate/login');
    }
  }, [status, router]);

  // Auto-generate slug from team name
  useEffect(() => {
    const slug = teamName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setTeamSlug(slug);
  }, [teamName]);

  function updateCandidate(id, field, value) {
    setCandidates(candidates.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!teamName || !teamSlug) {
      alert('Please enter a team name');
      return;
    }

    const validCandidates = candidates.filter(c => c.name && c.linkedin);
    if (validCandidates.length !== 2) {
      alert('Please fill in details for exactly 2 candidates (name and LinkedIn required)');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/candidate/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: teamName,
        slug: teamSlug,
        description: teamDescription,
        deadline: votingDeadline || null,
        candidates: validCandidates
      })
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      alert(data.error);
      return;
    }

    router.push('/candidate/dashboard');
  }

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Create Campaign - VotePlatform</title>
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
        <title>Create Campaign - VotePlatform</title>
      </Head>

      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        {/* Header */}
        <header className="navbar">
          <div className="navbar-inner">
            <Link
              href="/candidate/dashboard"
              className="btn-ghost"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            
            <Link href="/" className="navbar-brand">
              <div className="navbar-logo">
                <Vote size={18} color="white" />
              </div>
              <span>VotePlatform</span>
            </Link>
            
            <div style={{ width: 150 }}></div>
          </div>
        </header>

        {/* Main */}
        <main className="container" style={{ maxWidth: 720, paddingTop: 40, paddingBottom: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 style={{ 
              fontSize: 28, 
              fontWeight: 700, 
              marginBottom: 8,
              fontFamily: 'Space Grotesk, Sora, sans-serif',
            }}>
              Create New Campaign
            </h1>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: 32 }}>
              Set up your voting campaign and add candidates
            </p>

            <form onSubmit={handleSubmit}>
              {/* Team Details Section */}
              <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(139, 92, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <FileText size={20} style={{ color: 'var(--brand-secondary)' }} />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'Space Grotesk, Sora, sans-serif' }}>
                    Campaign Details
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <label className="input-label">Campaign Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="e.g., Board of Directors Election"
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="input-label">URL Slug</label>
                    <input
                      type="text"
                      value={teamSlug}
                      onChange={(e) => setTeamSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="board-election"
                      className="input"
                      required
                    />
                    <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                      Your campaign URL: <span style={{ color: 'var(--brand-accent)' }}>/team/{teamSlug || 'your-slug'}</span>
                    </p>
                  </div>

                  <div>
                    <label className="input-label">
                      Description
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8 }}>(optional)</span>
                    </label>
                    <textarea
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      placeholder="Describe what this voting is about..."
                      rows={3}
                      className="input"
                      style={{ resize: 'none', minHeight: 100 }}
                    />
                  </div>

                  <div>
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={14} />
                      Voting Deadline
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4 }}>(optional)</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={votingDeadline}
                      onChange={(e) => setVotingDeadline(e.target.value)}
                      className="input"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                      Leave empty for no deadline
                    </p>
                  </div>
                </div>
              </div>

              {/* Candidates Section */}
              <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(6, 182, 212, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Users size={20} style={{ color: 'var(--brand-accent)' }} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'Space Grotesk, Sora, sans-serif' }}>
                      Candidates
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                      Campaigns require exactly 2 candidates
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {candidates.map((candidate, index) => (
                    <div
                      key={candidate.id}
                      style={{
                        padding: 20,
                        borderRadius: 'var(--radius-lg)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8,
                        marginBottom: 16,
                        paddingBottom: 12,
                        borderBottom: '1px solid var(--border-subtle)',
                      }}>
                        <div style={{
                          width: 28,
                          height: 28,
                          borderRadius: 'var(--radius-md)',
                          background: index === 0 
                            ? 'rgba(99, 102, 241, 0.15)' 
                            : 'rgba(6, 182, 212, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <User size={14} style={{ 
                            color: index === 0 ? 'var(--brand-primary)' : 'var(--brand-accent)' 
                          }} />
                        </div>
                        <span style={{ 
                          fontSize: 13, 
                          fontWeight: 600,
                          color: index === 0 ? 'var(--brand-primary)' : 'var(--brand-accent)',
                        }}>
                          Candidate {index + 1}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                          <label className="input-label" style={{ fontSize: 12 }}>Name</label>
                          <input
                            type="text"
                            value={candidate.name}
                            onChange={(e) => updateCandidate(candidate.id, 'name', e.target.value)}
                            placeholder="Full name"
                            className="input"
                            required
                          />
                        </div>

                        <div>
                          <label className="input-label" style={{ fontSize: 12 }}>Bio / Description</label>
                          <input
                            type="text"
                            value={candidate.bio}
                            onChange={(e) => updateCandidate(candidate.id, 'bio', e.target.value)}
                            placeholder="Brief description or qualifications"
                            className="input"
                          />
                        </div>

                        <div>
                          <label className="input-label" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Linkedin size={12} />
                            LinkedIn Profile URL
                          </label>
                          <input
                            type="url"
                            value={candidate.linkedin}
                            onChange={(e) => updateCandidate(candidate.id, 'linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/profile"
                            className="input"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                <Link href="/candidate/dashboard" className="btn-secondary" style={{ padding: '14px 24px' }}>
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient"
                  style={{ 
                    width: 'auto',
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Campaign'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </>
  );
}
