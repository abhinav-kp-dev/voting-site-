import clientPromise from '../../../lib/mongodb';
import { randomBytes } from 'crypto';
import { sendPasswordResetEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const client = await clientPromise;
  const users = client.db().collection('users');
  const user = await users.findOne({ email });
  
  // Always return success to prevent email enumeration
  if (!user) return res.status(200).json({ ok: true });
  
  const token = randomBytes(20).toString('hex');
  const expires = Date.now() + 3600000; // 1 hour
  await users.updateOne({ email }, { $set: { resetToken: token, resetExpires: expires } });
  
  // Send the password reset email
  const emailResult = await sendPasswordResetEmail(email, token);
  
  if (!emailResult.success) {
    console.error('Failed to send reset email:', emailResult.error);
    // In development, log the reset link as fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('Password reset link (development):', `${process.env.NEXTAUTH_URL}/reset/${token}`);
    }
  }
  
  res.json({ ok: true });
}
