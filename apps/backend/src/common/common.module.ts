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
        dir:
          process.env.NODE_ENV === 'production'
            ? join(__dirname, '../../', 'src/common/templates')
            : join(__dirname, '/templates'),
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
