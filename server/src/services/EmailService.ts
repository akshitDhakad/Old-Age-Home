/**
 * Email Service
 * Handles sending emails using nodemailer
 * In production, use services like SendGrid, AWS SES, or Mailgun
 */

import nodemailer from 'nodemailer';
import { config } from '../config/env';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Initialize transporter based on environment
    // In development, use Ethereal or console logging
    // In production, configure with real SMTP credentials
    if (config.isDevelopment) {
      // Use Ethereal for development (creates test accounts)
      this.initializeDevelopmentTransporter();
    } else {
      // In production, configure with real SMTP
      this.initializeProductionTransporter();
    }
  }

  private async initializeDevelopmentTransporter() {
    try {
      // Create test account for development
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('📧 Email service initialized (Ethereal)');
    } catch (error) {
      console.warn('⚠️  Could not initialize email service, using console fallback');
      this.transporter = null;
    }
  }

  private initializeProductionTransporter() {
    // Configure with environment variables for production
    // Example: Gmail, SendGrid, AWS SES, etc.
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (smtpHost && smtpUser && smtpPass) {
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      console.log('📧 Email service initialized (Production SMTP)');
    } else {
      console.warn('⚠️  SMTP credentials not configured, using console fallback');
      this.transporter = null;
    }
  }

  /**
   * Send email
   */
  public async sendEmail(options: EmailOptions): Promise<void> {
    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    if (!this.transporter) {
      // Fallback: log to console in development
      console.log('\n📧 EMAIL (Console Fallback)');
      console.log('To:', recipients.join(', '));
      console.log('Subject:', options.subject);
      console.log('Body:', options.text || options.html);
      console.log('---\n');
      return;
    }

    try {
      for (const recipient of recipients) {
        const info = await this.transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@oldagehome.com',
          to: recipient,
          subject: options.subject,
          text: options.text,
          html: options.html,
        });

        if (config.isDevelopment) {
          // In development, log preview URL
          const previewUrl = nodemailer.getTestMessageUrl(info);
          if (previewUrl) {
            console.log('📧 Email preview:', previewUrl);
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      // Don't throw - email failures shouldn't break the app
      // In production, consider queuing failed emails for retry
    }
  }

  /**
   * Send emergency notification email
   */
  public async sendEmergencyNotification(
    recipientEmail: string,
    recipientName: string,
    customerName: string,
    customerPhone: string | undefined,
    address: string,
    notes: string | undefined
  ): Promise<void> {
    const subject = `🚨 URGENT: Emergency Care Request from ${customerName}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #dc2626; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 Emergency Care Request</h1>
            </div>
            <div class="content">
              <p>Dear ${recipientName},</p>
              <p><strong>An emergency care request has been submitted and requires immediate attention.</strong></p>
              
              <div class="info-box">
                <h3>Customer Details:</h3>
                <p><strong>Name:</strong> ${customerName}</p>
                ${customerPhone ? `<p><strong>Phone:</strong> ${customerPhone}</p>` : ''}
                <p><strong>Address:</strong> ${address}</p>
                ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
              </div>
              
              <p>Please respond to this emergency request as soon as possible.</p>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
                  View Dashboard
                </a>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated notification from Old Age Home Care System</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
URGENT: Emergency Care Request

Dear ${recipientName},

An emergency care request has been submitted and requires immediate attention.

Customer Details:
- Name: ${customerName}
${customerPhone ? `- Phone: ${customerPhone}` : ''}
- Address: ${address}
${notes ? `- Notes: ${notes}` : ''}

Please respond to this emergency request as soon as possible.

Visit your dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard

---
This is an automated notification from Old Age Home Care System
    `;

    await this.sendEmail({
      to: recipientEmail,
      subject,
      html,
      text,
    });
  }
}

export const emailService = new EmailService();

