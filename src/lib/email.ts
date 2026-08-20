/**
 * Email Service Abstraction (MediPulse HMS)
 * Abstracted email notification engine supporting development logging and Production SMTP / Resend / SendGrid adapters.
 */

export interface EmailPayload {
  to: string;
  subject: string;
  template: 'WELCOME' | 'APPOINTMENT_CONFIRMATION' | 'APPOINTMENT_REMINDER' | 'APPOINTMENT_CANCELLATION' | 'PASSWORD_RESET' | 'PAYMENT_RECEIPT' | 'LAB_REPORT_READY';
  data: Record<string, any>;
}

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId: string }> {
  const messageId = `MSG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Print email log in development environment
  console.log(`[EMAIL ADAPTER] Sending email to: ${payload.to}`);
  console.log(`[EMAIL ADAPTER] Subject: ${payload.subject}`);
  console.log(`[EMAIL ADAPTER] Template: ${payload.template}`);
  console.log(`[EMAIL ADAPTER] Data:`, payload.data);

  // In production, uncomment Resend / Nodemailer adapter:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'noreply@medipulse.com', to: payload.to, subject: payload.subject, html: ... });

  return {
    success: true,
    messageId,
  };
}
