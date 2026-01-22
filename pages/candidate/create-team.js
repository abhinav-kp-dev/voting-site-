import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Linkedin, Loader2, Calendar, CheckCircle2, User, Rocket, Star, TrendingUp, Award, Zap } from 'lucide-react';

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
          <title>Create Campaign - Votesy</title>
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
        <title>Create Campaign - Votesy</title>
      </Head>

      <div className="auth-page">
        {/* Left Side - Decorative */}
        <div className="auth-hero">
          <div className="auth-hero-content">
            <Link href="/candidate/dashboard" className="auth-back-link">
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/" className="auth-logo">
                <span>Votesy</span>
              </Link>
              <h1 className="auth-hero-title">
                Create your<br />
                <span className="text-gradient-purple">campaign.</span>
              </h1>

              <p className="auth-hero-description">
                Set up a new voting campaign and add candidates to start collecting votes from your community.
              </p>

              <div className="auth-features">
                <div className="auth-feature">
                  <div className="auth-feature-icon">
                    <Rocket size={20} />
                  </div>
                  <div>
                    <strong>Quick Setup</strong>
                    <span>Get your campaign live in minutes</span>
                  </div>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                    <TrendingUp size={20} style={{ color: '#34d399' }} />
                  </div>
                  <div>
                    <strong>Real-time Tracking</strong>
                    <span>Monitor votes as they come in</span>
                  </div>
                </div>
                <div className="auth-feature">
                  <div className="auth-feature-icon" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                    <Award size={20} style={{ color: '#22d3ee' }} />
                  </div>
                  <div>
                    <strong>Professional Results</strong>
                    <span>Share beautiful voting pages</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Animated background elements */}
          <div className="auth-hero-bg">
            <div className="auth-orb auth-orb-1"></div>
            <div className="auth-orb auth-orb-2"></div>
            <div className="auth-orb auth-orb-3"></div>
            <div className="auth-grid"></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-container" style={{ overflowY: 'auto' }}>
          <motion.div
            className="auth-form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ maxWidth: 520 }}
          >
            <div className="auth-form-header">
              <div className="signup-badge">
                <Rocket size={14} />
                <span>New Campaign</span>
              </div>
              <h2>Campaign Details</h2>
              <p>Fill in the information below to create your voting campaign</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Team Details Section */}
              <div className="auth-field">
                <label>Campaign Name</label>
                <div className="auth-input-wrapper">
                  <Users size={18} />
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g., Board of Directors Election"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>URL Slug</label>
                <div className="auth-input-wrapper">
                  <Zap size={18} />
                  <input
                    type="text"
                    value={teamSlug}
                    onChange={(e) => setTeamSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="board-election"
                    required
                  />
                </div>
                <span className="auth-field-hint">
                  Your campaign URL: <span style={{ color: 'var(--brand-accent)' }}>/team/{teamSlug || 'your-slug'}</span>
                </span>
              </div>

              <div className="auth-field">
                <label>
                  <span>Description</span>
                  <span className="auth-field-optional">Optional</span>
                </label>
                <textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="Describe what this voting is about..."
                  rows={3}
                  className="auth-textarea"
                />
              </div>

              <div className="auth-field">
                <label>
                  <span>Voting Deadline</span>
                  <span className="auth-field-optional">Optional</span>
                </label>
                <div className="auth-input-wrapper">
                  <Calendar size={18} />
                  <input
                    type="datetime-local"
                    value={votingDeadline}
                    onChange={(e) => setVotingDeadline(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <span className="auth-field-hint">Leave empty for no deadline</span>
              </div>

              {/* Candidates Section */}
              <div className="candidates-section">
                <div className="candidates-header">
                  <Users size={18} />
                  <h3>Candidates</h3>
                </div>
                <p className="candidates-description">
                  Campaigns require exactly 2 candidates
                </p>

                <div className="candidates-grid">
                  {candidates.map((candidate, index) => (
                    <div key={candidate.id} className="candidate-card">
                      <div className="candidate-card-header">
                        <div className={`candidate-badge candidate-badge-${index + 1}`}>
                          <User size={14} />
                          <span>Candidate {index + 1}</span>
                        </div>
                      </div>

                      <div className="candidate-fields">
                        <div className="auth-field">
                          <label>Name</label>
                          <input
                            type="text"
                            value={candidate.name}
                            onChange={(e) => updateCandidate(candidate.id, 'name', e.target.value)}
                            placeholder="Full name"
                            className="candidate-input"
                            required
                          />
                        </div>

                        <div className="auth-field">
                          <label>Bio / Description</label>
                          <input
                            type="text"
                            value={candidate.bio}
                            onChange={(e) => updateCandidate(candidate.id, 'bio', e.target.value)}
                            placeholder="Brief description or qualifications"
                            className="candidate-input"
                          />
                        </div>

                        <div className="auth-field">
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Linkedin size={12} />
                            LinkedIn Profile URL
                          </label>
                          <input
                            type="url"
                            value={candidate.linkedin}
                            onChange={(e) => updateCandidate(candidate.id, 'linkedin', e.target.value)}
                            placeholder="https://linkedin.com/in/profile"
                            className="candidate-input"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="form-actions">
                <Link href="/candidate/dashboard" className="btn-cancel">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="auth-submit-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Rocket size={18} />
                      Create Campaign
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          background: var(--bg-primary);
        }

        .auth-hero {
          flex: 1;
          display: none;
          position: relative;
          background: linear-gradient(135deg, #0a1f1a 0%, #0f1f2a 100%);
          overflow: hidden;
          padding: 48px;
        }

        @media (min-width: 1024px) {
          .auth-hero {
            display: flex;
            align-items: flex-start;
            padding-top: 80px;
          }
        }

        .auth-hero-content {
          position: relative;
          z-index: 10;
          max-width: 520px;
        }

        .auth-back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          font-weight: 500;
          margin-top: -20px;
          margin-bottom: 48px;
          transition: color 0.2s;
        }

        .auth-back-link:hover {
          color: rgba(255, 255, 255, 0.9);
        }

        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 22px;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          color: white;
          margin-bottom: 48px;
        }

        .auth-logo-icon {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(168, 85, 247, 0.3);
        }

        .auth-hero-title {
          font-size: 56px;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: white;
          margin-bottom: 24px;
        }

        .text-gradient-purple {
          background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-hero-description {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
          margin-bottom: 48px;
        }

        .auth-features {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-feature {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .auth-feature-icon {
          width: 48px;
          height: 48px;
          background: rgba(168, 85, 247, 0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c084fc;
        }

        .auth-feature strong {
          display: block;
          color: white;
          font-weight: 600;
          font-size: 15px;
        }

        .auth-feature span {
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
        }

        .auth-hero-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .auth-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: float 8s ease-in-out infinite;
        }

        .auth-orb-1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%);
          top: -100px;
          right: -100px;
        }

        .auth-orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
          bottom: -50px;
          left: -50px;
          animation-delay: -3s;
        }

        .auth-orb-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(192, 132, 252, 0.25) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -5s;
        }

        .auth-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 70%);
        }

        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px;
          background: var(--bg-primary);
        }

        @media (min-width: 1024px) {
          .auth-form-container {
            max-width: 600px;
          }
        }

        .auth-form-wrapper {
          width: 100%;
          max-width: 520px;
        }

        .auth-form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .signup-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid rgba(168, 85, 247, 0.2);
          border-radius: 20px;
          color: #c084fc;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .auth-form-header h2 {
          font-size: 28px;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .auth-form-header p {
          color: var(--text-tertiary);
          font-size: 15px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-field label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .auth-field-optional {
          font-size: 12px;
          font-weight: 400;
          color: var(--text-muted);
        }

        .auth-field-hint {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 6px;
          display: block;
        }

        .auth-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-input-wrapper > svg {
          position: absolute;
          left: 16px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .auth-input-wrapper input {
          width: 100%;
          padding: 14px 48px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 15px;
          transition: all 0.2s ease;
        }

        .auth-input-wrapper input::placeholder {
          color: var(--text-muted);
        }

        .auth-input-wrapper input:focus {
          outline: none;
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }

        .auth-textarea {
          width: 100%;
          padding: 14px 16px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 15px;
          font-family: inherit;
          resize: vertical;
          min-height: 100px;
          transition: all 0.2s ease;
        }

        .auth-textarea::placeholder {
          color: var(--text-muted);
        }

        .auth-textarea:focus {
          outline: none;
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.15);
        }

        .candidates-section {
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid var(--border-subtle);
        }

        .candidates-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .candidates-header svg {
          color: var(--brand-primary);
        }

        .candidates-header h3 {
          font-size: 18px;
          font-weight: 700;
          font-family: 'Space Grotesk', sans-serif;
          color: var(--text-primary);
        }

        .candidates-description {
          font-size: 14px;
          color: var(--text-tertiary);
          margin-bottom: 20px;
        }

        .candidates-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .candidate-card {
          padding: 20px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .candidate-card:hover {
          border-color: var(--border-hover);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .candidate-card-header {
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .candidate-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .candidate-badge-1 {
          background: rgba(168, 85, 247, 0.12);
          color: #a855f7;
        }

        .candidate-badge-2 {
          background: rgba(236, 72, 153, 0.12);
          color: #ec4899;
        }

        .candidate-fields {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .candidate-input {
          width: 100%;
          padding: 12px 16px;
          background: var(--bg-primary);
          border: 1px solid var(--border-default);
          border-radius: 10px;
          color: var(--text-primary);
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .candidate-input::placeholder {
          color: var(--text-muted);
        }

        .candidate-input:focus {
          outline: none;
          border-color: #a855f7;
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
        }

        .btn-cancel {
          flex: 1;
          padding: 14px 24px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 600;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: var(--surface-2);
          border-color: var(--border-hover);
        }

        .auth-submit-btn {
          flex: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 24px;
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.4);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
}
