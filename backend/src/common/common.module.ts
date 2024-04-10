import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { appEnv } from '../config';
import { EmailService, PrismaService } from './services';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: appEnv.EMAIL_URI,
      defaults: {
        from: '"No Reply" <webtimemachinedev@gmail.com>',
      },
      template: {
        dir: join(__dirname, '../../', 'src/assets/email-templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [PrismaService, EmailService],
  exports: [PrismaService, EmailService],
})
export class CommonModule {}
