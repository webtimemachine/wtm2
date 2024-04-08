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

    // Espiamos la función de error del logger
    loggerErrorSpy = jest.spyOn(service['logger'], 'error');
  });

  afterEach(() => {
    // Limpiamos los espias después de cada prueba
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationCodeEmail', () => {
    it('should send verification code email', async () => {
      // Código de prueba
    });

    it('should log error if sending verification code email fails', async () => {
      // Simulamos un error en el envío de correo electrónico
      const error = new Error('Sending failed');
      jest.spyOn(mailerService, 'sendMail').mockRejectedValue(error);

      // Ejecutamos la función bajo prueba
      await service.sendVerificationCodeEmail('test@example.com', '123456');

      // Verificamos que la función de error del logger se haya llamado con el error
      expect(loggerErrorSpy).toHaveBeenCalledWith(error);
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email', async () => {
      // Código de prueba
    });

    it('should log error if sending password reset email fails', async () => {
      // Simulamos un error en el envío de correo electrónico
      const error = new Error('Sending failed');
      jest.spyOn(mailerService, 'sendMail').mockRejectedValue(error);

      // Ejecutamos la función bajo prueba
      await service.sendPasswordResetEmail('test@example.com', 'newPassword');

      // Verificamos que la función de error del logger se haya llamado con el error
      expect(loggerErrorSpy).toHaveBeenCalledWith(error);
    });
  });
});
