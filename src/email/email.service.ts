// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured = false;

  constructor(private prisma: PrismaService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM;

    if (!host || !port || !user || !pass || !from) {
      console.warn('⚠️  Email not configured. Set SMTP_* environment variables to enable email notifications.');
      return;
    }

    // Validate hostname format to prevent DNS lookup errors
    if (host.includes('*') || host.includes('placeholder') || host.includes('example')) {
      console.warn(`⚠️  Invalid SMTP_HOST: ${host}. Email not configured.`);
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(port, 10),
        secure: parseInt(port, 10) === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });

      this.isConfigured = true;
      console.log('✅ Email service configured');
    } catch (error) {
      console.warn(`⚠️  Failed to configure email service: ${error.message}`);
      this.isConfigured = false;
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.warn('Email not sent - service not configured');
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      });
      console.log(`✅ Email sent to ${options.to}: ${options.subject}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  }

  async sendInspectionReminder(params: {
    extinguisherId: string;
    extinguisherLocation: string;
    building: string;
    nextInspection: Date;
    daysUntilDue: number;
    recipientEmail: string;
    recipientName: string;
    companyName: string;
  }): Promise<boolean> {
    const { extinguisherId, extinguisherLocation, building, nextInspection, daysUntilDue, recipientEmail, recipientName, companyName } = params;

    const urgencyColor = daysUntilDue <= 7 ? '#ef4444' : daysUntilDue <= 14 ? '#f59e0b' : '#3b82f6';
    const urgencyText = daysUntilDue <= 7 ? 'URGENT' : daysUntilDue <= 14 ? 'Important' : 'Upcoming';

    const subject = `${urgencyText}: Fire Extinguisher Inspection Due in ${daysUntilDue} Days`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inspection Reminder</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">🔥 Fire Safety Reminder</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">${companyName}</p>
    </div>

    <!-- Alert Badge -->
    <div style="background: white; padding: 20px; border-left: 4px solid ${urgencyColor};">
      <div style="display: inline-block; background: ${urgencyColor}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
        ${urgencyText}: ${daysUntilDue} Days Remaining
      </div>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${recipientName},</p>

      <p style="margin: 0 0 20px 0;">This is a reminder that a fire extinguisher inspection is due soon:</p>

      <!-- Extinguisher Details Card -->
      <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Extinguisher ID:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${extinguisherId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Location:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${extinguisherLocation}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Building:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${building}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Due Date:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: ${urgencyColor};">${this.formatDate(nextInspection)}</td>
          </tr>
        </table>
      </div>

      <p style="margin: 20px 0;">Please ensure this inspection is completed before the due date to maintain compliance with fire safety regulations.</p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.3);">
          View Dashboard
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0 0 10px 0;">This is an automated reminder from your Fire Safety Management System.</p>
      <p style="margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} ${companyName}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: recipientEmail,
      subject,
      html,
    });
  }

  async sendMaintenanceReminder(params: {
    extinguisherId: string;
    extinguisherLocation: string;
    building: string;
    nextMaintenance: Date;
    daysUntilDue: number;
    recipientEmail: string;
    recipientName: string;
    companyName: string;
  }): Promise<boolean> {
    const { extinguisherId, extinguisherLocation, building, nextMaintenance, daysUntilDue, recipientEmail, recipientName, companyName } = params;

    const urgencyColor = daysUntilDue <= 7 ? '#ef4444' : daysUntilDue <= 14 ? '#f59e0b' : '#3b82f6';
    const urgencyText = daysUntilDue <= 7 ? 'URGENT' : daysUntilDue <= 14 ? 'Important' : 'Upcoming';

    const subject = `${urgencyText}: Fire Extinguisher Maintenance Due in ${daysUntilDue} Days`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maintenance Reminder</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">🔧 Maintenance Reminder</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">${companyName}</p>
    </div>

    <!-- Alert Badge -->
    <div style="background: white; padding: 20px; border-left: 4px solid ${urgencyColor};">
      <div style="display: inline-block; background: ${urgencyColor}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
        ${urgencyText}: ${daysUntilDue} Days Remaining
      </div>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${recipientName},</p>

      <p style="margin: 0 0 20px 0;">This is a reminder that scheduled maintenance is due soon for a fire extinguisher:</p>

      <!-- Extinguisher Details Card -->
      <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #92400e; font-size: 14px;">Extinguisher ID:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${extinguisherId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #92400e; font-size: 14px;">Location:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${extinguisherLocation}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #92400e; font-size: 14px;">Building:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right;">${building}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #92400e; font-size: 14px;">Due Date:</td>
            <td style="padding: 8px 0; font-weight: 600; text-align: right; color: ${urgencyColor};">${this.formatDate(nextMaintenance)}</td>
          </tr>
        </table>
      </div>

      <p style="margin: 20px 0;">Please schedule maintenance before the due date to ensure continued compliance and safety.</p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; background: #f59e0b; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; box-shadow: 0 4px 6px rgba(245, 158, 11, 0.3);">
          View Dashboard
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0 0 10px 0;">This is an automated reminder from your Fire Safety Management System.</p>
      <p style="margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} ${companyName}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: recipientEmail,
      subject,
      html,
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  // ==================== VERIFICATION & PASSWORD RESET EMAILS ====================

  async sendVerificationEmail(email: string, name: string, token: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

    const html = `
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
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Verify Your Email</h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Hi ${name},
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Thank you for signing up for our Fire Safety Management System! Please verify your email address by clicking the button below.
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        This link will expire in 24 hours.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}"
           style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%); color: #ffffff;
                  text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Verify Email Address
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
        If you didn't create an account, you can safely ignore this email.
      </p>

      <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 20px 0 0 0;">
        Or copy and paste this link: <br/>
        <a href="${verificationUrl}" style="color: #7c3aed; word-break: break-all;">${verificationUrl}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0 0 10px 0;">Fire Safety Management System</p>
      <p style="margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, name: string, token: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Reset Your Password</h1>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        Hi ${name},
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
        We received a request to reset your password for your Fire Safety Management account.
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
        Click the button below to reset your password. This link will expire in 1 hour.
      </p>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}"
           style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff;
                  text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Reset Password
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
        If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
      </p>

      <p style="color: #6b7280; font-size: 12px; line-height: 1.6; margin: 20px 0 0 0;">
        Or copy and paste this link: <br/>
        <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0 0 10px 0;">Fire Safety Management System</p>
      <p style="margin: 0; font-size: 12px;">
        © ${new Date().getFullYear()} All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password',
      html,
    });
  }

  getConfigurationStatus(): { configured: boolean; message: string } {
    if (this.isConfigured) {
      return { configured: true, message: 'Email service is configured and ready' };
    }
    return {
      configured: false,
      message: 'Email service not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM in environment variables.',
    };
  }
}
