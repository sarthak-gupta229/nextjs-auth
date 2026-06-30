import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import VerificationEmail from '@/components/email-template';
import { render } from '@react-email/render';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESENDEMAIL_KEY);

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject:
        emailType === 'VERIFY'
          ? 'nextjs-auth | Verify your email'
          : 'nextjs-auth | Reset your password',
      react: VerificationEmail({
        emailType,
        hashedToken,
        domain: process.env.DOMAIN!,
      }),
    });

    if (error) {
      console.error(error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    throw new Error(error.message);
  }
};
