import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(email, resetToken) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset/${resetToken}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'Reset Your Password - VotePlatform',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #FDF8F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <table role="presentation" style="width: 100%; max-width: 480px; border-collapse: collapse;">
                  <!-- Logo -->
                  <tr>
                    <td align="center" style="padding-bottom: 32px;">
                      <div style="width: 56px; height: 56px; background-color: #1a1a1a; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px;">
                        🗳️
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Main Card -->
                  <tr>
                    <td style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e8e0d8; padding: 40px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
                      <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #1a1a1a; text-align: center;">
                        Reset Your Password
                      </h1>
                      <p style="margin: 0 0 24px; font-size: 15px; color: #666; text-align: center; line-height: 1.6;">
                        We received a request to reset your password. Click the button below to create a new password.
                      </p>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td align="center" style="padding: 8px 0 24px;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #1a1a1a; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 10px;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 16px; font-size: 13px; color: #888; text-align: center;">
                        This link will expire in <strong>1 hour</strong>.
                      </p>
                      
                      <hr style="border: none; border-top: 1px solid #e8e0d8; margin: 24px 0;">
                      
                      <p style="margin: 0; font-size: 13px; color: #888; text-align: center;">
                        If you didn't request this password reset, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding-top: 32px;">
                      <p style="margin: 0; font-size: 13px; color: #888;">
                        VotePlatform • Secure Online Voting
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `Reset Your Password

We received a request to reset your password for VotePlatform.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, you can safely ignore this email.

VotePlatform • Secure Online Voting`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}
