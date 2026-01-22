import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../components/Layout';
import { 
  ArrowLeft, 
  Share2, 
  Linkedin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users,
  Trophy,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TeamPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { slug } = router.query;
  const [team, setTeam] = useState(null);
  const [voters, setVoters] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);
  const [showLinkedinModal, setShowLinkedinModal] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [pendingCandidateId, setPendingCandidateId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/teams/${slug}`).then((r) => r.json()).then((d) => {
      setTeam(d.team);
      if (d.team?.deadline) {
        if (new Date(d.team.deadline) < new Date()) setIsExpired(true);
      }
    });
    fetchVoters();
  }, [slug]);

  const fetchVoters = async () => {
    const res = await fetch(`/api/teams/${slug}/voters`);
    const d = await res.json();
    setVoters(d.voters || []);
    setVoteCounts(d.voteCounts || {});
    setTotalVotes(d.totalVotes || 0);
  };

  // Countdown timer
  useEffect(() => {
    if (!team?.deadline) return;
    const updateTimer = () => {
      const diff = new Date(team.deadline) - new Date();
      if (diff <= 0) { setIsExpired(true); setTimeLeft(null); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [team?.deadline]);

  // Auto-refresh votes
  useEffect(() => {
    if (!slug) return;
    const interval = setInterval(fetchVoters, 30000);
    return () => clearInterval(interval);
  }, [slug]);

  async function vote(candidateId, linkedin = null) {
    if (!session) return signIn();
    if (isExpired) return alert('Voting has ended for this team.');

    setLoading(true);
    const res = await fetch('/api/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamSlug: slug, candidateId, linkedin })
    });
    const data = await res.json();
    setLoading(false);

    if (data.requireLinkedin) {
      setPendingCandidateId(candidateId);
      setShowLinkedinModal(true);
      return;
    }

    if (data.expired) { setIsExpired(true); return alert('Voting deadline has passed.'); }
    if (data.error) return alert(data.error);

    setVoters(data.voters);
    setVoted(true);
    setShowLinkedinModal(false);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    await fetchVoters();
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVotePercentage = (candidateId) => {
    if (totalVotes === 0) return 0;
    return Math.round(((voteCounts[candidateId] || 0) / totalVotes) * 100);
  };

  const getLeader = () => {
    if (!team?.candidates || totalVotes === 0) return null;
    let leaderId = null;
    let maxVotes = 0;
    for (const id in voteCounts) {
      if (voteCounts[id] > maxVotes) {
        maxVotes = voteCounts[id];
        leaderId = id;
      }
    }
    return leaderId;
  };

  if (!team) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </Layout>
    );
  }

  const leader = getLeader();

  return (
    <Layout title={`${team.name} - Votesy`}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Header Actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: 32 
        }}>
          <Link 
            href="/" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              color: 'var(--text-tertiary)',
              fontWeight: 500,
              transition: 'color var(--transition-fast)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
          >
            <ArrowLeft size={18} /> Back to Campaigns
          </Link>
          <button 
            onClick={copyLink} 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--surface-hover)';
              e.currentTarget.style.borderColor = 'var(--border-default)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface-1)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <Share2 size={16} /> {copied ? 'Copied!' : 'Share'}
          </button>
        </div>

        {/* Team Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h1 className="text-gradient" style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
            fontWeight: 800,
            fontFamily: 'Space Grotesk, Sora, sans-serif',
            letterSpacing: '-0.03em',
            marginBottom: 16,
          }}>
            {team.name}
          </h1>
          <p style={{ 
            fontSize: 18, 
            color: 'var(--text-secondary)', 
            maxWidth: 600, 
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}>
            {team.description || 'Choose your preferred candidate from the options below'}
          </p>

          {/* Status Badge */}
          {isExpired ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              borderRadius: 'var(--radius-full)',
              color: '#fca5a5',
              fontSize: 14,
              fontWeight: 600,
            }}>
              <AlertCircle size={18} /> Voting Closed
            </div>
          ) : timeLeft && (
            <div className="countdown">
              {timeLeft.days > 0 && (
                <div className="countdown-item">
                  <div className="countdown-value">{timeLeft.days}</div>
                  <div className="countdown-label">Days</div>
                </div>
              )}
              <div className="countdown-item">
                <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="countdown-label">Hours</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="countdown-label">Mins</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="countdown-label">Secs</div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Live Results */}
        {totalVotes > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: 32,
              marginBottom: 48,
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: 24,
              flexWrap: 'wrap',
              gap: 16,
            }}>
              <h3 style={{ 
                fontSize: 18, 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <CheckCircle2 size={20} style={{ color: 'var(--brand-primary)' }} />
                Live Results
              </h3>
              <span className="badge badge-primary">
                <Users size={12} />
                {totalVotes} {totalVotes === 1 ? 'Vote' : 'Votes'}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {team.candidates.map((candidate) => {
                const pct = getVotePercentage(candidate.id);
                const isLeading = leader === candidate.id;
                return (
                  <div key={candidate.id}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: 8,
                      alignItems: 'center',
                    }}>
                      <span style={{ 
                        fontWeight: 600, 
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        {isLeading && <Trophy size={14} style={{ color: '#fbbf24' }} />}
                        {candidate.name}
                      </span>
                      <span style={{ 
                        color: 'var(--brand-primary)', 
                        fontWeight: 700,
                        fontSize: 14,
                      }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Candidates Grid */}
        <div className="team-grid" style={{ marginBottom: 48 }}>
          {team.candidates.map((candidate, index) => {
            const isLeading = leader === candidate.id && totalVotes > 0;
            return (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={voted ? 'vote-card selected' : 'vote-card'}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {isLeading && (
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 10px',
                    background: 'rgba(251, 191, 36, 0.15)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#fbbf24',
                  }}>
                    <Trophy size={12} /> Leading
                  </div>
                )}
                
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'var(--gradient-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: 20,
                  fontFamily: 'Space Grotesk, Sora, sans-serif',
                }}>
                  {candidate.name.charAt(0)}
                </div>
                
                <h3 style={{ 
                  fontSize: 20, 
                  fontWeight: 700, 
                  marginBottom: 8,
                  fontFamily: 'Space Grotesk, Sora, sans-serif',
                }}>
                  {candidate.name}
                </h3>
                <p style={{ 
                  fontSize: 14, 
                  color: 'var(--text-secondary)', 
                  lineHeight: 1.6,
                  marginBottom: 20,
                  flex: 1,
                }}>
                  {candidate.bio || 'No bio provided'}
                </p>

                {candidate.linkedin && (
                  <a 
                    href={candidate.linkedin} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      color: '#0A66C2',
                      fontWeight: 500,
                      marginBottom: 20,
                      transition: 'opacity var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    <Linkedin size={14} /> View LinkedIn
                  </a>
                )}

                <button
                  onClick={() => vote(candidate.id)}
                  disabled={loading || voted || isExpired}
                  className={voted ? 'btn-gradient' : 'btn-primary'}
                  style={{ 
                    marginTop: 'auto',
                    opacity: voted || isExpired ? 0.6 : 1,
                  }}
                >
                  {voted ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      <CheckCircle2 size={18} /> Vote Recorded
                    </span>
                  ) : isExpired ? 'Voting Closed' : 'Vote for ' + candidate.name.split(' ')[0]}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* LinkedIn Modal */}
        <AnimatePresence>
          {showLinkedinModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-overlay"
              onClick={() => setShowLinkedinModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start' 
                  }}>
                    <div>
                      <h3 style={{ 
                        fontSize: 20, 
                        fontWeight: 700, 
                        marginBottom: 8,
                        fontFamily: 'Space Grotesk, Sora, sans-serif',
                      }}>
                        Verify Your Identity
                      </h3>
                      <p style={{ color: 'var(--text-tertiary)', fontSize: 14 }}>
                        To ensure fair voting, please provide your LinkedIn profile
                      </p>
                    </div>
                    <button
                      onClick={() => setShowLinkedinModal(false)}
                      className="btn-icon"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="modal-body">
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">LinkedIn Profile URL</label>
                    <div className="input-with-icon">
                      <Linkedin size={18} className="input-icon" />
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer" style={{ flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={() => {
                      if (!linkedinUrl.includes('linkedin.com')) {
                        alert('Please enter a valid LinkedIn URL');
                        return;
                      }
                      vote(pendingCandidateId, linkedinUrl);
                    }}
                    className="btn-gradient"
                  >
                    Verify & Submit Vote
                  </button>
                  <button
                    onClick={() => setShowLinkedinModal(false)}
                    className="btn-ghost"
                    style={{ width: '100%' }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
