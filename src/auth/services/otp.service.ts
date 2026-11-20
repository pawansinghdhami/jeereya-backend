import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createHmac, randomInt } from 'node:crypto';
import { DataSource, Repository } from 'typeorm';
import { OtpChallenge } from '../../users/entities/otp-challenge.entity';
import { timingSafeEqual } from 'node:crypto';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(OtpChallenge)
    private readonly otpChallengeRepository: Repository<OtpChallenge>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async createChallenge(
    userMobileNum: string,
  ): Promise<{ otpChallengeIdNum: number; otpCode: string }> {
    const otpCode = randomInt(0, 1_000_000).toString().padStart(6, '0');
    const secret = this.configService.getOrThrow<string>('OTP_HMAC_SECRET');

    const otpHash = createHmac('sha256', secret)
      .update(`${userMobileNum}:${otpCode}`)
      .digest('hex');

    const challenge = this.otpChallengeRepository.create({
      user_mobile_num: userMobileNum,
      otp_hash: otpHash,
      expires_at_dtm: new Date(Date.now() + 5 * 60 * 1000),
      consumed_at_dtm: null,
      attempts: 0,
    });

    const savedChallenge = await this.otpChallengeRepository.save(challenge);

    return {
      otpChallengeIdNum: savedChallenge.otp_challenge_id_num,
      otpCode,
    };
  }

  async expireChallenge(otpChallengeIdNum: number): Promise<void> {
    const result = await this.otpChallengeRepository.update(
      { otp_challenge_id_num: otpChallengeIdNum },
      { expires_at_dtm: new Date() },
    );

    if (result.affected !== 1) {
      throw new Error('Could not invalidate OTP challenge');
    }
  }

  async verifyChallenge(
    otpChallengeIdNum: number,
    otpCode: string,
  ): Promise<string> {
    const secret = this.configService.getOrThrow<string>('OTP_HMAC_SECRET');

    const verifiedMobile = await this.dataSource.transaction(
      async (manager) => {
        const repository = manager.getRepository(OtpChallenge);

        const challenge = await repository
          .createQueryBuilder('challenge')
          .setLock('pessimistic_write')
          .where('challenge.otp_challenge_id_num = :id', {
            id: otpChallengeIdNum,
          })
          .getOne();

        const now = new Date();
        const maxAttempts = 5;

        if (
          !challenge ||
          challenge.consumed_at_dtm !== null ||
          challenge.expires_at_dtm <= now ||
          challenge.attempts >= maxAttempts
        ) {
          return null;
        }

        challenge.attempts += 1;

        const submittedHash = createHmac('sha256', secret)
          .update(`${challenge.user_mobile_num}:${otpCode}`)
          .digest();

        const storedHash = Buffer.from(challenge.otp_hash, 'hex');

        if (
          storedHash.length !== submittedHash.length ||
          !timingSafeEqual(storedHash, submittedHash)
        ) {
          if (challenge.attempts >= maxAttempts) {
            challenge.expires_at_dtm = now;
          }

          await repository.save(challenge);
          return null;
        }

        challenge.consumed_at_dtm = now;
        await repository.save(challenge);

        return challenge.user_mobile_num;
      },
    );

    if (verifiedMobile === null) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }
    
    return verifiedMobile;
  }
}
