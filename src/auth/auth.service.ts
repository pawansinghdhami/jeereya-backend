import { Injectable } from '@nestjs/common';
import { OtpService } from './services/otp.service';
import { SmsService } from './services/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpService: OtpService,
    private readonly smsService: SmsService,
  ) {}

  async requestOtp(
    userMobileNum: string,
  ): Promise<{ otpChallengeIdNum: number; expiresInSeconds: number }> {
    const challenge = await this.otpService.createChallenge(userMobileNum);

    try {
      await this.smsService.sendOtp(userMobileNum, challenge.otpCode);
    } catch (error) {
      await this.otpService.expireChallenge(challenge.otpChallengeIdNum);
      throw error;
    }

    return {
      otpChallengeIdNum: challenge.otpChallengeIdNum,
      expiresInSeconds: 300,
    };
  }
}
