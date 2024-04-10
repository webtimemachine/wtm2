import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let mailerService: MailerService;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);

    loggerErrorSpy = jest.spyOn(service['logger'], 'error');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationCodeEmail', () => {
    it('should send verification code email', async () => {});

    it('should log error if sending verification code email fails', async () => {
      const error = new Error('Sending failed');
      jest.spyOn(mailerService, 'sendMail').mockRejectedValue(error);

      await service.sendVerificationCodeEmail('test@example.com', '123456');

      expect(loggerErrorSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email', async () => {});

    it('should log error if sending password reset email fails', async () => {
      const error = new Error('Sending failed');
      jest.spyOn(mailerService, 'sendMail').mockRejectedValue(error);

      await service.sendPasswordResetEmail('test@example.com', 'newPassword');

      expect(loggerErrorSpy).toHaveBeenCalledWith(error);
    });
  });
});
