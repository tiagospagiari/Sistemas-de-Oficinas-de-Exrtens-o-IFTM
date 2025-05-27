import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'extensao.upt@iftm.edu.br',
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { to, subject, html } = data;

    const mailOptions = {
      from: 'extensao.upt@iftm.edu.br',
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return NextResponse.json({ success: false, error: 'Erro ao enviar e-mail' }, { status: 500 });
  }
} 