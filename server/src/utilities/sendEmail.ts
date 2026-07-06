import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "../config/env";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  const info = await transporter.sendMail({
    from: `"subApi (subscription tracker application)" <${SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`Email sent: ${info.messageId}`);
  return info;
};
