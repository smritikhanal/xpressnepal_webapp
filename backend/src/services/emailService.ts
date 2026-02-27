import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS } from '../config/env.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export const sendResetPasswordEmail = async (email: string, resetUrl: string) => {
    if (!EMAIL_USER || !EMAIL_PASS) {
        console.warn('SMTP credentials are not defined. Email will not be sent.');
        console.log(`[Mock Email] To: ${email}, Link: ${resetUrl}`);
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: `"XpressNepal" <${EMAIL_USER}>`,
            to: email,
            subject: 'Reset Your Password',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your XpressNepal account.</p>
          <p>Click the button below to reset your password. This link is valid for 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
        });

        console.log('Email sent successfully:', info.messageId);
    } catch (err) {
        console.error('Email service error:', err);
        throw err;
    }
};
