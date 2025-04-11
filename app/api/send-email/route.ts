import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'oficinasextensaoiftm@gmail.com',
    pass: 'rzdb ioyh hwpc pmcg'
  }
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { to, subject, html } = data;

    const mailOptions = {
      from: 'oficinasextensaoiftm@gmail.com',
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