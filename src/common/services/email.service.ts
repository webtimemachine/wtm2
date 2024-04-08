import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private logger = new Logger('EmailService');

  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCodeEmail(
    to: string,
    verificationCode: string,
    firstName?: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'WEBTM: Verification code',
        template: './account-validation.template.hbs',
        context: {
          verificationCode,
          firstName: firstName || 'user',
        },
      });
      this.logger.log(`verification code email sent to ${to}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendPasswordResetEmail(
    to: string,
    randomPassword: string,
    firstName?: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'WEBTM: Password Reset',
        template: './password-reset.template.hbs',
        context: {
          to,
          randomPassword,
          firstName: firstName || 'user',
        },
      });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
