import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Linkedin, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CompleteProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [session, setSession] = useState(null);

    useEffect(() => {
        getSession().then(session => {
            if (!session) {
                router.push('/candidate/login');
            } else if (session.user?.linkedin) {
                // Already has LinkedIn, redirect to dashboard
                router.push('/candidate/dashboard');
            } else {
                setSession(session);
            }
        });
    }, [router]);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const linkedin = e.target.linkedin.value;

        const res = await fetch('/api/candidate/complete-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ linkedin })
        });

        const data = await res.json();
        setLoading(false);

        if (data.error) {
            setError(data.error);
            return;
        }

        // Redirect to dashboard
        window.location.href = '/candidate/dashboard';
    }

    if (!session) {
        return null; // Loading or redirecting
    }

    return (
        <>
            <Head>
                <title>Complete Your Profile - Votesy</title>
            </Head>

            <div className="complete-profile-page">
                <motion.div
                    className="complete-profile-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="complete-profile-header">
                        <div className="complete-profile-icon">
                            <CheckCircle2 size={32} />
                        </div>
                        <h1>One More Step!</h1>
                        <p>To participate as a candidate, please provide your LinkedIn profile URL</p>
                    </div>

                    {error && (
                        <motion.div
                            className="complete-profile-error"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="complete-profile-form">
                        <div className="complete-profile-field">
                            <label>LinkedIn Profile URL *</label>
                            <div className="complete-profile-input-wrapper">
                                <Linkedin size={18} />
                                <input
                                    name="linkedin"
                                    type="url"
                                    required
                                    placeholder="https://linkedin.com/in/yourprofile"
                                    autoComplete="url"
                                    autoFocus
                                />
                            </div>
                            <span className="complete-profile-hint">
                                This helps voters learn more about your professional background
                            </span>
                        </div>

                        <button type="submit" className="complete-profile-submit" disabled={loading}>
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Continue to Dashboard
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>

                <style jsx global>{`
          .complete-profile-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--bg-primary);
            padding: 32px;
          }
          
          .complete-profile-card {
            width: 100%;
            max-width: 480px;
            background: var(--bg-elevated);
            border: 1px solid var(--border-default);
            border-radius: 20px;
            padding: 48px;
          }
          
          .complete-profile-header {
            text-align: center;
            margin-bottom: 32px;
          }
          
          .complete-profile-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            margin-bottom: 24px;
            box-shadow: 0 12px 40px rgba(34, 197, 94, 0.3);
          }
          
          .complete-profile-header h1 {
            font-size: 28px;
            font-weight: 700;
            font-family: 'Space Grotesk', sans-serif;
            color: var(--text-primary);
            margin-bottom: 12px;
          }
          
          .complete-profile-header p {
            font-size: 15px;
            color: var(--text-tertiary);
            line-height: 1.5;
          }
          
          .complete-profile-error {
            background: var(--error-bg);
            border: 1px solid var(--error-border);
            color: #fca5a5;
            padding: 14px 16px;
            border-radius: 12px;
            font-size: 14px;
            margin-bottom: 24px;
            text-align: center;
          }
          
          .complete-profile-form {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          
          .complete-profile-field label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: var(--text-secondary);
            margin-bottom: 8px;
          }
          
          .complete-profile-input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }
          
          .complete-profile-input-wrapper > svg {
            position: absolute;
            left: 16px;
            color: var(--text-muted);
            pointer-events: none;
          }
          
          .complete-profile-input-wrapper input {
            width: 100%;
            padding: 14px 48px;
            background: var(--bg-primary);
            border: 1px solid var(--border-default);
            border-radius: 12px;
            color: var(--text-primary);
            font-size: 15px;
            transition: all 0.2s ease;
          }
          
          .complete-profile-input-wrapper input::placeholder {
            color: var(--text-muted);
          }
          
          .complete-profile-input-wrapper input:focus {
            outline: none;
            border-color: #22c55e;
            box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
          }
          
          .complete-profile-hint {
            font-size: 13px;
            color: var(--text-muted);
          }
          
          .complete-profile-submit {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 16px 24px;
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            border: none;
            border-radius: 12px;
            color: white;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .complete-profile-submit:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(34, 197, 94, 0.4);
          }
          
          .complete-profile-submit:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
            </div>
        </>
    );
}
