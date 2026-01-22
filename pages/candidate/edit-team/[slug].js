import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Users, 
  Linkedin, 
  Loader2, 
  Calendar, 
  FileText, 
  Download, 
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  User,
  Lock
} from 'lucide-react';

export default function EditTeam() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [votingDeadline, setVotingDeadline] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [votersCount, setVotersCount] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/candidate/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (slug && status === 'authenticated') {
      fetchTeam();
    }
  }, [slug, status]);

  async function fetchTeam() {
    const res = await fetch(`/api/candidate/teams/${slug}`);
    const data = await res.json();
    if (data.error) {
      alert(data.error);
      router.push('/candidate/dashboard');
      return;
    }
    setTeamName(data.team.name);
    setTeamDescription(data.team.description || '');
    if (data.team.deadline) {
      const d = new Date(data.team.deadline);
      const formatted = d.toISOString().slice(0, 16);
      setVotingDeadline(formatted);
    }
    setCandidates(data.team.candidates || []);
    setVotersCount(data.team.voteCount || 0);
    setLoading(false);
  }

  const downloadVotersList = async (format = 'csv') => {
    try {
      const url = `/api/teams/${slug}/download-voters?format=${format}`;
      
      if (format === 'json') {
        const res = await fetch(url);
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `voters-${slug}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download voters list');
    }
  };

  function updateCandidate(id, field, value) {
    setCandidates(candidates.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validCandidates = candidates.filter(c => c.name && c.linkedin);
    if (validCandidates.length !== 2) {
      alert('Please fill in details for exactly 2 candidates (name and LinkedIn required)');
      return;
    }

    setSaving(true);
    const res = await fetch(`/api/candidate/teams/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: teamName,
        description: teamDescription,
        deadline: votingDeadline || null,
        candidates: validCandidates
      })
    });

    const data = await res.json();
    setSaving(false);

    if (data.error) {
      alert(data.error);
      return;
    }

    router.push('/candidate/dashboard');
  }

  if (status === 'loading' || loading) {
    return (
      <>
        <Head>
          <title>Edit Campaign - Votesy</title>
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
        <title>Edit Campaign - Votesy</title>
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
                <CheckCircle2 size={18} color="white" />
              </div>
              <span>Votesy</span>
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
              Edit Campaign
            </h1>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: 32 }}>
              Update your campaign details and candidates
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
                    <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Lock size={12} />
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={slug}
                      disabled
                      className="input"
                      style={{ 
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-muted)',
                        cursor: 'not-allowed',
                      }}
                    />
                    <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)' }}>
                      URL slug cannot be changed after creation
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

              {/* Download Voters Section */}
              <div className="card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  gap: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      borderRadius: 'var(--radius-lg)',
                      background: 'var(--success-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Download size={20} style={{ color: 'var(--success)' }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Space Grotesk, Sora, sans-serif' }}>
                        Download Voters List
                      </h2>
                      <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                        {votersCount > 0
                          ? `${votersCount} voter${votersCount !== 1 ? 's' : ''} have participated`
                          : 'No votes yet for this campaign'
                        }
                      </p>
                    </div>
                  </div>

                  {votersCount > 0 && (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        type="button"
                        onClick={() => downloadVotersList('csv')}
                        className="btn-primary"
                        style={{ 
                          padding: '10px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 13,
                        }}
                      >
                        <FileSpreadsheet size={14} />
                        CSV
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadVotersList('json')}
                        className="btn-secondary"
                        style={{ 
                          padding: '10px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 13,
                        }}
                      >
                        <FileJson size={14} />
                        JSON
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                <Link href="/candidate/dashboard" className="btn-secondary" style={{ padding: '14px 24px' }}>
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gradient"
                  style={{ 
                    width: 'auto',
                    padding: '14px 32px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
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
