
import dotenv from 'dotenv';

dotenv.config();

export const CLIENT_URL: string = process.env.CLIENT_URL || 'http://localhost:3000';
export const EMAIL_USER: string = process.env.EMAIL_USER || '';
export const EMAIL_PASS: string = process.env.EMAIL_PASS || '';
