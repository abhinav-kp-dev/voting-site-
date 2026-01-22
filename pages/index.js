import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import CursorGlow from '../components/CursorTrail';
import {
  Users,
  CheckCircle2,
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
  const heroRef = useRef(null);

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
    <Layout title="Votesy - Professional Voting Platform">
      {/* Hero Section */}
      <section className="hero" ref={heroRef} style={{ position: 'relative' }}>
        {/* Cursor Glow Effect */}
        <CursorGlow containerRef={heroRef} />
        
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
            background: 'radial-gradient(ellipse 50% 80% at 50% 0%, rgba(34, 197, 94, 0.15) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'absolute',
            top: '40%',
            right: '-10%',
            width: '40%',
            height: '60%',
            background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.1) 0%, transparent 60%)',
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
                  gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
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
                  gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
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
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: 15,
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all var(--transition-base)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.4)';
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
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle2 size={24} color="white" />
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
                        <CheckCircle2 size={16} />
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
                <CheckCircle2 size={32} />
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

      {/* Stats Section */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: 'var(--radius-xl)',
              padding: '48px 32px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background decoration */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '60%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, transparent 60%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }} />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 32,
              position: 'relative',
              zIndex: 1,
            }}>
              {[
                { value: '50K+', label: 'Active Voters', icon: Users },
                { value: '1M+', label: 'Votes Cast', icon: CheckCircle2 },
                { value: '99.9%', label: 'Uptime', icon: Zap },
                { value: '500+', label: 'Campaigns', icon: BarChart3 },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    background: 'rgba(34, 197, 94, 0.15)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: 16,
                  }}>
                    <stat.icon size={24} style={{ color: '#4ade80' }} />
                  </div>
                  <div style={{
                    fontSize: 36,
                    fontWeight: 700,
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: 'var(--text-tertiary)',
                  }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: 48 }}
          >
            <h2 style={{
              fontSize: 32,
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              color: 'var(--text-primary)',
              marginBottom: 12,
            }}>
              How <span style={{ color: '#4ade80' }}>Votesy</span> Works
            </h2>
            <p style={{
              fontSize: 16,
              color: 'var(--text-tertiary)',
              maxWidth: 500,
              margin: '0 auto',
            }}>
              Create your voting campaign in three simple steps
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
          }}>
            {[
              {
                step: '01',
                title: 'Create Campaign',
                description: 'Sign up as a candidate and set up your voting campaign with custom options.',
                color: '#22c55e',
              },
              {
                step: '02',
                title: 'Share Link',
                description: 'Share your unique voting link with your audience via any platform.',
                color: '#06b6d4',
              },
              {
                step: '03',
                title: 'Collect Votes',
                description: 'Watch votes come in real-time with verified LinkedIn users.',
                color: '#06b6d4',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 32,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: 64,
                  fontWeight: 800,
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: item.color,
                  opacity: 0.1,
                  lineHeight: 1,
                }}>
                  {item.step}
                </div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  background: `${item.color}20`,
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 20,
                  color: item.color,
                  fontSize: 16,
                  fontWeight: 700,
                }}>
                  {item.step}
                </div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: 'var(--text-tertiary)',
                  lineHeight: 1.6,
                }}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, #0a1f1a 0%, #0f1f2a 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '64px 32px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(34, 197, 94, 0.2)',
            }}
          >
            {/* Background orbs */}
            <div style={{
              position: 'absolute',
              top: '-20%',
              left: '10%',
              width: 300,
              height: 300,
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-20%',
              right: '10%',
              width: 250,
              height: 250,
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  borderRadius: 16,
                  marginBottom: 24,
                  boxShadow: '0 20px 60px rgba(34, 197, 94, 0.3)',
                }}
              >
                <CheckCircle2 size={32} color="white" />
              </motion.div>

              <h2 style={{
                fontSize: 36,
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                color: 'white',
                marginBottom: 16,
              }}>
                Ready to Start Voting?
              </h2>
              <p style={{
                fontSize: 18,
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: 500,
                margin: '0 auto 32px',
                lineHeight: 1.6,
              }}>
                Join thousands of organizations using Votesy to make decisions that matter.
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 16,
                justifyContent: 'center',
              }}>
                <Link
                  href="/signup"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: 'var(--radius-lg)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 24px rgba(34, 197, 94, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 24px rgba(34, 197, 94, 0.3)';
                  }}
                >
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link
                  href="/candidate/signup"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '16px 32px',
                    background: 'transparent',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  Register as Candidate
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
