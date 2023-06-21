import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private logger = new Logger('EmailService');

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  async sendEmailVerification(email: string, token: string) {
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject: 'Email Verification',
      text: `Click on the link to verify your email: http://localhost:${process.env.PORT}/auth/verify-email?token=${token}`,
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        this.logger.error(error);
      } else {
        this.logger.log(`Email sent to ${email}: ` + info.response);
      }
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const mailOptions = {
      from: process.env.GOOGLE_EMAIL,
      to: email,
      subject: 'Password Reset',
      text: `Click on the link to reset your password: ${process.env.APP_URL}/reset-password?token=${token}`,
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        this.logger.error(error);
      } else {
        this.logger.log(`Email sent to ${email}: ` + info.response);
      }
    });
  }
}
