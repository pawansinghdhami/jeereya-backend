import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendOtp(userMobileNum: string, otpCode: string): Promise<void> {
    const mode = this.configService.getOrThrow<string>('SMS_MODE');
    const nodeEnv = this.configService.getOrThrow<string>('NODE_ENV');

    if (mode === 'mock') {
      if (nodeEnv === 'test') {
        return;
      }
      if (nodeEnv !== 'development') {
        throw new Error('Mock SMS is allowed only in development or tests');
      }

      const maskedMobile = `${userMobileNum.slice(0,3)}****${userMobileNum.slice(-2)}`;
        this.logger.warn(`[DEV ONLY] OTP for ${maskedMobile}: ${otpCode}`);
        return;
      }

      if(mode === 'provider') {
        throw new ServiceUnavailableException(
            'Production SMS provider is not configured',
        );
      }
      
      throw new Error(`Unsupported SMS_MODE: ${mode}`);
    }
  }
