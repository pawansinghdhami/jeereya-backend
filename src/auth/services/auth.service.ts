import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'node:crypto';
import { OtpService } from './otp.service';
import { SmsService } from './sms.service';
import { User } from '../../users/entities/user.entity';
import { UserSession } from '../../users/entities/user-session.entity';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { UserStatus } from '../../users/enums/user-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpService: OtpService,
    private readonly smsService: SmsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.userRepository.findOneBy({
      user_mobile_num: dto.user_mobile_num,
    });

    if (existingUser) {
      throw new ConflictException('Mobile number is already registered');
    }

    const passwordHash = await argon2.hash(dto.user_password, {
      type: argon2.argon2id,
    });

    try {
      const user = await this.userRepository.save(
        this.userRepository.create({
          user_mobile_num: dto.user_mobile_num,
          user_password_hash: passwordHash,
          is_user_verified: false,
        }),
      );

      return {
        user_id_num: user.user_id_num,
        user_mobile_num: user.user_mobile_num,
        is_user_verified: user.is_user_verified,
      };
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23505'
      ) {
        throw new ConflictException('Mobile number is already registered');
      }

      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.user_password_hash')
      .where('user.user_mobile_num = :mobile', {
        mobile: dto.user_mobile_num,
      })
      .getOne();

    if (
      !user ||
      user.user_status !== UserStatus.ACTIVE ||
      !(await argon2.verify(user.user_password_hash, dto.user_password))
    ) {
      throw new UnauthorizedException('Invalid mobile number or password');
    }

    const accessToken = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const tokenHash = createHash('sha256').update(accessToken).digest('hex');

    await this.userSessionRepository.save(
      this.userSessionRepository.create({
        user,
        token_hash: tokenHash,
        expires_at_dtm: expiresAt,
        revoked_at_dtm: null,
      }),
    );

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresInSeconds: 86400,
      user: {
        user_id_num: user.user_id_num,
        user_mobile_num: user.user_mobile_num,
        is_user_verified: user.is_user_verified,
      },
    };
  }

  async logout(session: UserSession) {
    if (session.revoked_at_dtm) {
      return {
        loggedOut: true,
      };
    }
    await this.userSessionRepository.update(
      { user_session_id_num: session.user_session_id_num },
      { revoked_at_dtm: new Date() },
    );
    return { loggedOut: true };
  }

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
