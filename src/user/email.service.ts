/* eslint-disable prettier/prettier */
// email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'yashjadhav.synsoft@gmail.com',
        pass: 'cbnj dwpi ezsl cwrk',
      },
    });
  }

  async sendResetPasswordEmail(
    email: string,
    resetToken: string,
  ): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'yashjadhav.synsoft@gmail.com',
      to: email,
      subject: 'Reset Your Password',
      text: `Click the following link to reset your password: http://your-app-url/reset-password?token=${resetToken}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
