import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { 
  Users, 
  Vote, 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Shield, 
  BarChart3,
  CheckCircle,
  Globe,
  Lock
} from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      try {
        const res = await fetch('/api/teams');
        const data = await res.json();
        setTeams(data.teams || []);
      } catch (err) {
        console.error('Failed to load teams');
      }
      setLoading(false);
    }
    loadTeams();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <Layout title="VotePlatform - Professional Voting Platform">
      {/* Hero Section */}
      <section className="hero">
        {/* Background Effects */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140%',
            height: '100%',
            background: 'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'absolute',
            top: '40%',
            right: '-10%',
            width: '40%',
            height: '60%',
            background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px 6px 8px',
                background: 'var(--gradient-brand-subtle)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: 'var(--radius-full)',
                marginBottom: 32,
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                background: 'var(--gradient-brand)',
                borderRadius: '50%',
              }}>
                <Sparkles size={12} color="white" />
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                Trusted by 10,000+ voters
              </span>
            </motion.div>

            <h1 className="hero-title">
              The Modern Way to{' '}
              <span className="text-gradient">Collect Votes</span>
            </h1>
            
            <p className="hero-subtitle">
              Create professional voting campaigns, collect votes securely, and 
              visualize results in real-time. Built for teams who value transparency.
            </p>
            
            {!session && status !== 'loading' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 16,
                  justifyContent: 'center',
                }}
              >
                <Link
                  href="/signup"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '16px 32px',
                    background: 'var(--text-primary)',
                    color: 'var(--bg-primary)',
                    fontWeight: 600,
                    fontSize: 15,
                    borderRadius: 'var(--radius-lg)',
                    transition: 'all var(--transition-base)',
                    boxShadow: '0 4px 24px rgba(255, 255, 255, 0.1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 255, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(255, 255, 255, 0.1)';
                  }}
                >
                  Start Free <ArrowRight size={18} />
                </Link>
                <Link
                  href="/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '16px 32px',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: 15,
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-default)',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface-hover)';
                    e.currentTarget.style.borderColor = 'var(--border-strong)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-default)';
                  }}
                >
                  Sign In
                </Link>
              </motion.div>
            )}

            {session && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 20px',
                  background: 'var(--success-bg)',
                  border: '1px solid var(--success-border)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <CheckCircle size={18} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#86efac' }}>
                  Welcome back, {session.user.name?.split(' ')[0]}!
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Only show for non-logged in users */}
      {!session && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-100px' }}
              className="feature-grid"
            >
              {[
                { 
                  icon: Zap, 
                  title: 'Real-time Results', 
                  desc: 'Watch votes come in live with instant updates and beautiful visualizations',
                  gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'
                },
                { 
                  icon: Shield, 
                  title: 'Secure & Verified', 
                  desc: 'LinkedIn verification ensures one authentic vote per person',
                  gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                },
                { 
                  icon: BarChart3, 
                  title: 'Advanced Analytics', 
                  desc: 'Get detailed insights with comprehensive voting analytics',
                  gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                },
                { 
                  icon: Globe, 
                  title: 'Shareable Links', 
                  desc: 'Share your voting page with a simple link. Works everywhere.',
                  gradient: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)'
                },
                { 
                  icon: Lock, 
                  title: 'Privacy First', 
                  desc: 'Your data is encrypted and protected. We never sell your information.',
                  gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'
                },
                { 
                  icon: Users, 
                  title: 'Team Collaboration', 
                  desc: 'Invite team members and manage campaigns together seamlessly.',
                  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="feature-card"
                >
                  <div 
                    className="feature-icon"
                    style={{ background: feature.gradient }}
                  >
                    <feature.icon size={24} color="white" />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="cta-section"
              style={{ marginTop: 64 }}
            >
              <h3 className="cta-title">Ready to create your voting campaign?</h3>
              <p className="cta-description">
                Register as a candidate and set up your professional voting page in minutes.
              </p>
              <Link
                href="/candidate/signup"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 28px',
                  background: 'var(--gradient-brand)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Register as Candidate <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Teams Section */}
      <section className="section" style={{ paddingTop: session ? 0 : undefined }}>
        <div className="container">
          <div className="section-header">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', alignItems: 'center', gap: 16 }}
            >
              <div style={{
                width: 48,
                height: 48,
                background: 'var(--gradient-brand)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Vote size={24} color="white" />
              </div>
              <div>
                <h2 className="section-title">Active Campaigns</h2>
                <p className="section-subtitle">Browse and vote for your favorite teams</p>
              </div>
            </motion.div>
          </div>

          {loading ? (
            <div className="team-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} style={{
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: 24,
                }}>
                  <div className="skeleton" style={{ height: 24, width: '70%', marginBottom: 12 }} />
                  <div className="skeleton" style={{ height: 16, width: '100%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 24 }} />
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div className="skeleton" style={{ height: 20, width: 80 }} />
                    <div className="skeleton" style={{ height: 20, width: 80 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : teams.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: '-50px' }}
              className="team-grid"
            >
              {teams.map((team, index) => (
                <motion.div
                  key={team.slug}
                  variants={fadeInUp}
                >
                  <Link href={`/team/${team.slug}`} className="team-card">
                    <h3 className="team-card-title">{team.name}</h3>
                    <p className="team-card-description line-clamp-2">
                      {team.description || 'Vote for your preferred candidate from this team'}
                    </p>
                    
                    <div className="team-card-meta">
                      <div className="team-card-stat">
                        <Users size={16} />
                        <span>{team.candidates?.length || 0} Candidates</span>
                      </div>
                      <div className="team-card-stat">
                        <Vote size={16} />
                        <span>{team.totalVotes || 0} Votes</span>
                      </div>
                    </div>

                    <div className="team-card-action">
                      View Campaign <ArrowRight size={16} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="empty-state"
              style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div className="empty-state-icon">
                <Vote size={32} />
              </div>
              <h3 className="empty-state-title">No active campaigns yet</h3>
              <p className="empty-state-description">
                Be the first to create a voting campaign and start collecting votes!
              </p>
              <Link
                href="/candidate/signup"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 24px',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  fontWeight: 600,
                  fontSize: 14,
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Create Campaign <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
