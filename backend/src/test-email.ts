import dotenv from 'dotenv';
import { verifyEmailConnection, sendPasswordResetEmail } from './utils/email.js';

dotenv.config();

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Email:', process.env.USER_EMAIL);
  console.log('Has Key:', !!process.env.USER_EMAIL_KEY);
  console.log('Key length:', process.env.USER_EMAIL_KEY?.length);
  console.log('Key (first 4 chars):', process.env.USER_EMAIL_KEY?.substring(0, 4));
  console.log('Key (last 4 chars):', process.env.USER_EMAIL_KEY?.substring(process.env.USER_EMAIL_KEY.length - 4));
  console.log('All env vars with USER:', Object.keys(process.env).filter(k => k.includes('USER')));
  
  // Test connection
  const isConnected = await verifyEmailConnection();
  
  if (isConnected) {
    console.log('\n✅ Email service is properly configured!');
    
    // Test sending email
    try {
      console.log('\nAttempting to send test email...');
      await sendPasswordResetEmail(process.env.USER_EMAIL!, 'test-token-12345');
      console.log('✅ Test email sent successfully!');
    } catch (error) {
      console.error('❌ Failed to send test email:', error);
    }
  } else {
    console.log('\n❌ Email service configuration failed!');
  }
}

testEmail();
