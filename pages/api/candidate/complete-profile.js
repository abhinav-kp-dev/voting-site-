import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const session = await getServerSession(req, res, authOptions);

        if (!session?.user?.email) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const { linkedin } = req.body;

        if (!linkedin) {
            return res.status(400).json({ error: 'LinkedIn profile URL is required' });
        }

        if (!linkedin.includes('linkedin.com')) {
            return res.status(400).json({ error: 'Please provide a valid LinkedIn URL' });
        }

        const client = await clientPromise;
        const db = client.db();
        const users = db.collection('users');

        // Update user with LinkedIn profile and set role to candidate
        const result = await users.updateOne(
            { email: session.user.email },
            {
                $set: {
                    linkedin,
                    role: 'candidate',
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ ok: true });
    } catch (error) {
        console.error('Complete profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
