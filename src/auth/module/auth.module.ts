import { Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpService } from '../services/otp.service';
import { OtpChallenge } from '../../users/entities/otp-challenge.entity';
import { SmsService } from '../services/sms.service';
import { User } from '../../users/entities/user.entity';
import { UserSession } from '../../users/entities/user-session.entity';
import { SessionAuthGuard } from '../guards/session-auth.guard';
import { AuthService } from '../services/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([OtpChallenge, User, UserSession])],
  controllers: [AuthController],
  providers: [AuthService, OtpService, SmsService, SessionAuthGuard],
})
export class AuthModule {}
