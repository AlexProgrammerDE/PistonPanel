import { ReactNode } from 'react';
import { Resend } from 'resend';

export async function sendEmail(
  to: string,
  subject: string,
  content: ReactNode,
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    react: content,
  });
}
