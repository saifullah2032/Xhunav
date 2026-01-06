import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json();

    // IMPORTANT: Replace with your actual SMTP credentials
    // It's highly recommended to use environment variables for this
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'your-email@example.com',
        pass: process.env.SMTP_PASSWORD || 'your-password',
      },
    });

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Xhunav Election Commission'}" <${process.env.SMTP_FROM_EMAIL || 'noreply@xhunav.com'}>`,
      to: to,
      subject: subject,
      html: body.replace(/\n/g, '<br>'), // Replace newlines with <br> for HTML email
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to send email:', error);
    // In a real app, you might want more specific error messages
    return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
  }
}
