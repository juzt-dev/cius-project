import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  from = 'CIUS <noreply@cius.com>',
  replyTo,
}: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

// Email templates
export const emailTemplates = {
  contactConfirmation: (name: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0066cc;">Thank you for contacting us!</h2>
          <p>Dear ${name},</p>
          <p>We have received your message and our team will get back to you shortly.</p>
          <p>Best regards,<br>CIUS Team</p>
        </div>
      </body>
    </html>
  `,

  careerApplication: (name: string, position: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0066cc;">Career Application Received</h2>
          <p>Dear ${name},</p>
          <p>Thank you for applying for the <strong>${position}</strong> position at CIUS.</p>
          <p>Our HR team will review your application and contact you soon.</p>
          <p>Best regards,<br>CIUS HR Team</p>
        </div>
      </body>
    </html>
  `,

  reportDownload: (email: string) => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0066cc;">Download Your Report</h2>
          <p>Thank you for your interest in our report.</p>
          <p>Click the link below to download:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/downloads/report.pdf" 
             style="display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Download Report
          </a>
          <p>Best regards,<br>CIUS Team</p>
        </div>
      </body>
    </html>
  `,
};
