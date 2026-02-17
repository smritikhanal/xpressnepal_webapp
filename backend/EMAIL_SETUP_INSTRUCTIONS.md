**Important: Gmail App Password Setup**

The email sending is failing because of authentication issues. Follow these steps:

1. **Enable 2-Factor Authentication** (if not already enabled):
   - Go to https://myaccount.google.com/security
   - Find "2-Step Verification" and turn it on

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Sign in with your Gmail account
   - Select "Mail" and "Other (Custom name)" 
   - Name it "XpressNepal"
   - Click "Generate"
   - Copy the 16-character password (shown as: xxxx xxxx xxxx xxxx)

3. **Update .env file**:
   ```
   USER_EMAIL=smritikhanal45@gmail.com
   USER_EMAIL_KEY=yournew16charpassword
   USER_EMAIL_APP_NAME=XpressNepal
   ```
   (Remove all spaces when pasting the password)

4. **Test the email**:
   ```bash
   cd backend
   npx tsx src/test-email.ts
   ```

If you don't see the "App passwords" option, it means:
- 2FA is not enabled, OR
- You're using a Google Workspace account with different security settings
