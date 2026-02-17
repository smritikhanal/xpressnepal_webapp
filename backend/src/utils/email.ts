import nodemailer from 'nodemailer';

/**
 * Get email transporter (created on-demand to ensure env vars are loaded)
 */
const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_EMAIL_KEY,
        },
    });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
    to: string,
    resetToken: string
): Promise<void> => {
    const transporter = getTransporter();
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
        from: `"${process.env.USER_EMAIL_APP_NAME}" <${process.env.USER_EMAIL}>`,
        to,
        subject: 'Password Reset Request - XpressNepal',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You requested a password reset for your XpressNepal account.</p>
                <p>Click the button below to reset your password:</p>
                <a href="${resetUrl}" 
                   style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; 
                          color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    Reset Password
                </a>
                <p>Or copy and paste this link in your browser:</p>
                <p style="color: #666; word-break: break-all;">${resetUrl}</p>
                <p style="color: #999; font-size: 12px; margin-top: 24px;">
                    This link will expire in 1 hour. If you didn't request this, please ignore this email.
                </p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Verify email transporter connection
 */
export const verifyEmailConnection = async (): Promise<boolean> => {
    try {
        const transporter = getTransporter();
        await transporter.verify();
        console.log('✅ Email service connected successfully');
        console.log(`   Using: ${process.env.USER_EMAIL}`);
        return true;
    } catch (error) {
        console.error('❌ Email service connection failed:', error);
        console.error('   Email:', process.env.USER_EMAIL);
        console.error('   Has Key:', !!process.env.USER_EMAIL_KEY);
        return false;
    }
};

export default getTransporter;
