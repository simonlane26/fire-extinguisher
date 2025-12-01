// Test email sending with your SMTP configuration
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.production' });

async function testEmail() {
  const testRecipient = process.argv[2] || 'simonlane22@gmail.com';

  console.log('\n🔧 Email Configuration Test\n');
  console.log('SMTP Settings:');
  console.log(`  Host: ${process.env.SMTP_HOST}`);
  console.log(`  Port: ${process.env.SMTP_PORT}`);
  console.log(`  User: ${process.env.SMTP_USER}`);
  console.log(`  From: ${process.env.SMTP_FROM}`);
  console.log(`  To: ${testRecipient}\n`);

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Missing SMTP configuration in .env.production');
    process.exit(1);
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: parseInt(process.env.SMTP_PORT, 10) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('📧 Sending test email...');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: testRecipient,
      subject: '🔥 Test Email - Fire Safety System',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✅ Email Test Successful!</h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Congratulations! Your email configuration is working correctly.
      </p>

      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 20px 0;">
        <p style="color: #166534; margin: 0; font-weight: 600;">
          ✓ SMTP Connection Successful
        </p>
        <p style="color: #166534; margin: 8px 0 0 0; font-size: 14px;">
          Your Fire Safety Management System can now send:
        </p>
        <ul style="color: #166534; margin: 8px 0 0 20px; padding: 0; font-size: 14px;">
          <li>Email verification emails</li>
          <li>Password reset emails</li>
          <li>Inspection reminder emails</li>
          <li>Maintenance notifications</li>
        </ul>
      </div>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
        Sent at: <strong>${new Date().toLocaleString()}</strong>
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0;">Fire Safety Management System - Email Test</p>
      <p style="margin: 8px 0 0 0; font-size: 12px;">
        © ${new Date().getFullYear()} All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
      `,
      text: 'Email Test Successful! Your SMTP configuration is working correctly.',
    });

    console.log('\n✅ Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    console.log(`\n📬 Check your inbox at: ${testRecipient}\n`);
  } catch (error) {
    console.error('\n❌ Failed to send email:');
    console.error(error.message);
    console.error('\nCommon issues:');
    console.error('  - Wrong SMTP credentials');
    console.error('  - SMTP server blocking connection');
    console.error('  - Firewall blocking port 465');
    console.error('  - Need to enable "Less secure app access" or "App passwords"\n');
    process.exit(1);
  }
}

testEmail();
