import type { ReactNode } from "react";
import { Resend } from "resend";

export async function sendEmail(
  from: string,
  to: string,
  replyTo: string,
  subject: string,
  content: ReactNode,
) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from,
    to,
    replyTo,
    subject,
    react: content,
  });
}
