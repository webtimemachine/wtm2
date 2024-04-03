import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private logger = new Logger('EmailService');

  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(
    to: string,
    randomPassword: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Password Reset',
        template: './password-reset.template.hbs',
        context: {
          to,
          randomPassword,
          firstName: 'user',
        },
      });
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
