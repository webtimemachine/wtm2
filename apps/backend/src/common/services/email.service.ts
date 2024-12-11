import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { WebTMLogger } from '../../common/helpers/webtm-logger';

@Injectable()
export class EmailService {
  private logger = new WebTMLogger('EmailService');

  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCodeEmail(to: string, code: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'WEBTM: Verification code',
        template: './account-validation.template.hbs',
        context: {
          code,
          user: to,
        },
      });
      this.logger.log(`Verification code email sent to ${to}`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendPasswordResetEmail(
    to: string,
    randomPassword: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'WEBTM: Password Reset',
        template: './password-reset.template.hbs',
        context: {
          to,
          code: randomPassword,
          user: to,
        },
      });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
